<template>
  <div class="app-container">
    <!-- $t is vue-i18n global function to translate lang -->
    <el-input style='width:340px;' :placeholder="$t('excel.placeholder')" prefix-icon="el-icon-document" v-model="filename"></el-input>
    <el-button style='margin-bottom:20px' type="primary" icon="document" @click="handleDownload" :loading="downloadLoading">{{$t('excel.selectedExport')}}</el-button>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit highlight-current-row @selection-change="handleSelectionChange"
      ref="multipleTable">
      <el-table-column type="selection" align="center"></el-table-column>
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
  name: 'selectExcel',
  data() {
    return {
      list: null,
      listLoading: true,
      multipleSelection: [],
      downloadLoading: false,
      filename: ''
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
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleDownload() {
      if (this.multipleSelection.length) {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['万位', '千位', '百位', '十位', '个位', '结果']
          const filterVal = ['wanDigit', 'qianDigit', 'baiDigit', 'shiDigit', 'geDigit', 'result']
          const list = this.multipleSelection
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: this.filename
          })
          this.$refs.multipleTable.clearSelection()
          this.downloadLoading = false
        })
      } else {
        this.$message({
          message: '至少选一项',
          type: 'warning'
        })
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>
