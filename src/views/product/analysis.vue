<template>
  <div class="app-container calendar-list-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入产品代码" v-model="listQuery.productCode">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button class="filter-item" type="primary" @click="handleCreate" icon="el-icon-edit">添加</el-button>
      <el-button class="filter-item" type="primary" :loading="downloadLoading" v-waves icon="el-icon-download"
                 @click="handleDownload">导出
      </el-button>
    </div>

    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
              highlight-current-row>

      <!--<el-table-column align="center" width="150px" label="主键" prop="idEveryColorData">
      </el-table-column>-->

      <el-table-column align="center" width="150px" label="产品代码" prop="productCode" sortable>
      </el-table-column>

      <el-table-column align="center" min-width="100px" label="开奖期数" prop="lotteryPeriod" sortable>
      </el-table-column>

      <el-table-column align="center" min-width="150px" label="开奖日期" prop="lotteryDate" :formatter="formatterDate">
      </el-table-column>

      <el-table-column align="center" min-width="60px" label="万位" prop="wanDigit">
      </el-table-column>

      <el-table-column align="center" min-width="60px" label="千位" prop="qianDigit">
      </el-table-column>

      <el-table-column align="center" min-width="60px" label="百位" prop="baiDigit">
      </el-table-column>

      <el-table-column align="center" min-width="60px" label="十位" prop="shiDigit">
      </el-table-column>

      <el-table-column align="center" min-width="60px" label="个位" prop="geDigit">
      </el-table-column>

      <el-table-column align="center" min-width="60px" label="大小" prop="bigDeal" :formatter="formatterBigDeal">
      </el-table-column>

      <el-table-column align="center" min-width="60px" label="龙虎和" prop="vingtEtun" :formatter="formatterVingtEtun">
      </el-table-column>

      <el-table-column align="center" min-width="60px" label="奇偶" prop="parity" :formatter="formatterParity">
      </el-table-column>

      <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="dataForm" status-icon label-position="left" label-width="100px"
               style='width: 400px; margin-left:50px;'>
        <el-form-item label="主键" prop="idEveryColorData" v-show="false">
          <el-input v-model="dataForm.idEveryColorData"></el-input>
        </el-form-item>
        <el-form-item label="商品代码" prop="productCode">
          <el-input v-model="dataForm.productCode"></el-input>
        </el-form-item>
        <el-form-item label="开奖期数" prop="lotteryPeriod">
          <el-input v-model="dataForm.lotteryPeriod"></el-input>
        </el-form-item>
        <el-form-item label="开奖日期" prop="lotteryDate">
          <el-date-picker v-model="dataForm.lotteryDate" type="datetime" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="万位" prop="wanDigit">
          <el-input v-model="dataForm.wanDigit"></el-input>
        </el-form-item>
        <el-form-item label="千位" prop="qianDigit">
          <el-input v-model="dataForm.qianDigit"></el-input>
        </el-form-item>
        <el-form-item label="百位" prop="baiDigit">
          <el-input v-model="dataForm.baiDigit"></el-input>
        </el-form-item>
        <el-form-item label="十位" prop="shiDigit">
          <el-input v-model="dataForm.shiDigit"></el-input>
        </el-form-item>
        <el-form-item label="个位" prop="geDigit">
          <el-input v-model="dataForm.geDigit"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { listAnalysisResult, createAnalysisContent, updateAnalysisContent, deleteAnalysisContent } from '@/api/analysis'
  import waves from '@/directive/waves' // 水波纹指令

  export default {
    name: 'Analysis',
    directives: {
      waves
    },
    data() {
      return {
        list: null,
        excelList: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          productCode: undefined,
          sort: '+lotteryPeriod'
        },
        listExcelQuery: {
          page: 1,
          limit: 20000,
          productCode: undefined,
          sort: '+lotteryPeriod'
        },
        dataForm: {
          idEveryColorData: undefined,
          productCode: undefined,
          lotteryPeriod: undefined,
          lotteryDate: undefined,
          wanDigit: undefined,
          qianDigit: undefined,
          baiDigit: undefined,
          shiDigit: undefined,
          geDigit: undefined
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '创建'
        },
        rules: {
          productCode: [{ required: true, message: '产品代码不能为空', trigger: 'blur' }],
          lotteryPeriod: [{ required: true, message: '开奖期数不能为空', trigger: 'blur' }],
          lotteryDate: [{ required: true, message: '开奖日期不能为空', trigger: 'blur' }],
          wanDigit: [{ required: true, message: '万位不能为空', trigger: 'blur' }],
          qianDigit: [{ required: true, message: '千位不能为空', trigger: 'blur' }],
          baiDigit: [{ required: true, message: '百位不能可空', trigger: 'blur' }],
          shiDigit: [{ required: true, message: '十位不能为空', trigger: 'blur' }],
          geDigit: [{ required: true, message: '个位不能为空', trigger: 'blur' }]
        },
        downloadLoading: false
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        listAnalysisResult(this.listQuery).then(response => {
          this.list = response.data.data.items
          this.total = response.data.data.total
          this.listLoading = false
        }).catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      resetForm() {
        this.dataForm = {
          productCode: undefined,
          lotteryPeriod: undefined,
          wanDigit: undefined,
          qianDigit: undefined,
          baiDigit: undefined,
          shiDigit: undefined,
          geDigit: undefined
        }
      },
      handleCreate() {
        this.resetForm()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            createAnalysisContent(this.dataForm).then(response => {
              this.list.unshift(response.data.data)
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '保存成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      handleUpdate(row) {
        this.dataForm = Object.assign({}, row)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            updateAnalysisContent(this.dataForm).then(() => {
              for (const v of this.list) {
                if (v.idEveryColorData === this.dataForm.idEveryColorData) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.dataForm)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      handleDelete(row) {
        deleteAnalysisContent(row).then(response => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
        })
      },
      handleDownload() {
        this.downloadLoading = true
        this.getExcelList()
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['产品代码', '万位', '千位', '百位', '十位', '个位', '大小', '龙虎和', '奇偶']
          const filterVal = ['productCode', 'wanDigit', 'qianDigit', 'baiDigit', 'shiDigit', 'geDigit', 'bigDeal', 'vingtEtun', 'parity']
          excel.export_json_to_excel2(tHeader, this.excelList, filterVal, '六合彩分析结果导出')
          this.downloadLoading = false
        })
      },
      getExcelList() {
        this.listExcelQuery.productCode = this.listQuery.productCode
        listAnalysisResult(this.listExcelQuery).then(response => {
          this.excelList = response.data.data.items
        }).catch(() => {
          this.excelList = []
        })
      },
      formatterBigDeal(row) {
        switch (row.bigDeal) {
          case '1':
            return '大'
          case '2':
            return '小'
          default:
            return '未知'
        }
      },
      formatterVingtEtun(row) {
        switch (row.vingtEtun) {
          case '1':
            return '龙'
          case '2':
            return '虎'
          case '3':
            return '和'
          default:
            return '未知'
        }
      },
      formatterParity(row) {
        switch (row.parity) {
          case '1':
            return '奇'
          case '2':
            return '偶'
          default:
            return '未知'
        }
      },
      formatterDate(row) {
        var date = row.lotteryDate
        if (date === undefined) {
          return ''
        }
        return date.replace('T', ' ')
      }
    }
  }
</script>

<style scoped>

</style>
