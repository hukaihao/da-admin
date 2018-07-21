<template>
  <div class="app-container">
    <el-button style='margin:0 0 20px 20px;' type="primary" icon="document" @click="handleDownload">
      {{$t('excel.export')}} excel
    </el-button>
  </div>
</template>
<script>
  import { downErrorFile } from '@/api/cqssc-upload' // downErrorFile

  export default {
    data() {
      return {
        downloadData: {
          fileName: null
        }
      }
    },
    methods: {
      handleDownload() {
        this.downloadData.fileName = 'cqsscError'
        downErrorFile(this.downloadData).then(response => {
          const blob = new Blob([response.data], { type: 'application/octet-stream' })
          const fileName = this.downloadData.fileName
          if (window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(blob, fileName)
          } else {
            var link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.download = fileName
            link.click()
            window.URL.revokeObjectURL(link.href)
          }
        }).catch(() => {
          console.log()
        })
      }
    }
  }
</script>
