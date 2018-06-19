<template>
  <!-- $t is vue-i18n global function to translate lang -->
  <div class="app-container">

    <label class="radio-label" style="padding-left:0;">文件名: </label>
    <el-input style='width:340px;' :placeholder="$t('excel.placeholder')" prefix-icon="el-icon-document" v-model="filename"></el-input>
    <label class="radio-label">自适应宽度</label>
    <el-radio-group v-model="autoWidth">
      <el-radio :label="true" border>是</el-radio>
      <el-radio :label="false" border>否</el-radio>
    </el-radio-group>
    <el-button style='margin:0 0 20px 20px;' type="primary" icon="document" @click="handleDownload" :loading="downloadLoading">{{$t('excel.export')}} excel</el-button>

    <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit highlight-current-row>
      <el-table-column align="center" label='序号' width="95">
        <template slot-scope="scope">
          {{scope.$index}}
        </template>
      </el-table-column>
      <el-table-column label="万位" width="110" align="center">
        <template slot-scope="scope">
          {{scope.row.wanDigit}}
        </template>
      </el-table-column>
      <el-table-column label="千位" width="110" align="center">
        <template slot-scope="scope">
          {{scope.row.qianDigit}}
        </template>
      </el-table-column>
      <el-table-column label="百位" width="115" align="center">
        <template slot-scope="scope">
          {{scope.row.baiDigit}}
        </template>
      </el-table-column>
      <el-table-column label="十位" width="115" align="center">
        <template slot-scope="scope">
          {{scope.row.shiDigit}}
        </template>
      </el-table-column>
      <el-table-column label="个位" width="115" align="center">
        <template slot-scope="scope">
          {{scope.row.geDigit}}
        </template>
      </el-table-column>
      <el-table-column label="结果"  align="center">
        <template slot-scope="scope">
          <el-tag>{{scope.row.result}}</el-tag>
        </template>
      </el-table-column>

    </el-table>

  </div>
</template>

<script>
  import { parseTime } from '@/utils'

  const List = []
  const count = 10

  for (let i = 0; i < count; i++) {
    List.push({
      wanDigit: '1',
      qianDigit: '2',
      baiDigit: '3',
      shiDigit: '4',
      geDigit: '5',
      result: '小'
    })
  }

  export default {
    name: 'exportExcel',
    data() {
      return {
        list: List,
        listLoading: true,
        downloadLoading: false,
        filename: '',
        autoWidth: true
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.listLoading = true
        this.list = List
        this.listLoading = false
      },
      handleDownload() {
        if (this.filename === null || this.filename.length === 0) {
          alert('文件名不可为空')
          return
        }
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['万位', '千位', '百位', '十位', '个位', '结果']
          const filterVal = ['wanDigit', 'qianDigit', 'baiDigit', 'shiDigit', 'geDigit', 'result']
          const list = this.list
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: this.filename,
            autoWidth: this.autoWidth
          })
          this.downloadLoading = false
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      }
    }
  }
</script>

<style>
.radio-label {
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 30px;
}
</style>

