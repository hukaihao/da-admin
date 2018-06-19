<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="万位">
        <el-col :span="11">
          <el-input v-model="form.wanDigit"></el-input>
        </el-col>
        <el-col class="line" :span="2"></el-col>
      </el-form-item>
      <el-form-item label="千位">
        <el-col :span="11">
          <el-input v-model="form.qianDigit"></el-input>
        </el-col>
        <el-col class="line" :span="2"></el-col>
      </el-form-item>
      <el-form-item label="百位">
        <el-col :span="11">
          <el-input v-model="form.baiDigit"></el-input>
        </el-col>
        <el-col class="line" :span="2"></el-col>
      </el-form-item>
      <el-form-item label="十位">
        <el-col :span="11">
          <el-input v-model="form.shiDigit"></el-input>
        </el-col>
        <el-col class="line" :span="2"></el-col>
      </el-form-item>
      <el-form-item label="个位">
        <el-col :span="11">
          <el-input v-model="form.geDigit"></el-input>
        </el-col>
        <el-col class="line" :span="2"></el-col>
      </el-form-item>
      <el-form-item label="数据时间">
        <el-col :span="11">
          <el-date-picker type="date" placeholder="Pick a date" v-model="form.date1" style="width: 100%;"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2"></el-col>
      </el-form-item>
      <el-form-item label="备注">
        <el-col :span="11">
          <el-input type="textarea" v-model="form.desc"></el-input>
        </el-col>
        <el-col class="line" :span="2"></el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    }
  },
  methods: {
    onSubmit() {
      this.$message('submit!')
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

