<template>
  <div class="app-container">
    <div id="drop">
      <el-upload
        drag
        action="/upload/cqssc"
        multiple
        accept=".xlsx, .xls"
        :limit="1"
        :file-list="fileList"
        :http-request="uploadFile">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传xls/xlsx文件</div>
      </el-upload>
    </div>
  </div>
</template>
<script>
  import { uploadFile, downErrorFile } from '@/api/cqssc-upload' // downErrorFile

  export default {
    data() {
      return {
        fileList: [],
        downloadData: {
          fileName: null
        }
      }
    },
    methods: {
      uploadFile(content) {
        const form = new FormData()
        form.append('file', content.file)
        uploadFile(form).then(response => {
          this.downloadData.fileName = response.data.data.result
          if (this.downloadData.fileName === 'success') {
            content.onSuccess()
            alert('上传成功')
          } else {
            content.onError()
            this.$alert('文件解析失败,是否下载错误文件', '提示', {
              confirmButtonText: '确定',
              type: 'error',
              callback: action => {
                downErrorFile(this.downloadData).then(response => {
                  const blob = new Blob([response.data], {type: 'application/octet-stream'})
                  const fileName = this.downloadData.fileName
                  if (window.navigator.msSaveOrOpenBlob) {
                    navigator.msSaveBlob(blob, fileName) // 创建下载的链接
                  } else {
                    var link = document.createElement('a')
                    link.href = window.URL.createObjectURL(blob)
                    link.download = fileName // 下载后文件名
                    link.click() // 点击下载
                    window.URL.revokeObjectURL(link.href) // 释放掉blob对象
                  }
                }).catch(() => {
                  console.log()
                })
              }
            })
          }
        }).catch(error => {
          if (error.response) {
            content.onError('文件上传失败(' + error.response.status + '),' + error.response.data)
          } else if (error.request) {
            content.onError('文件上传失败，服务器端无响应')
          } else {
            content.onError('配时文件上传失败，请求封装失败')
          }
        })
      }
    }
  }
</script>

<style scoped>
  #drop {
    border: 2px dashed #bbb;
    width: 600px;
    height: 185px;
    /*line-height: 160px;*/
    margin: 0 auto;
    font-size: 24px;
    border-radius: 5px;
    text-align: center;
    color: #bbb;
    position: relative;
  }
</style>
