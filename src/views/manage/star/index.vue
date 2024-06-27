<template>
  <div>
  <div style="margin: 30px 0 30px 20px; font-size: 25px">创建星球</div>
    <el-form label-width="100px" :model="form" :rules="rules" ref="starForm">
      <el-form-item label="星球昵称：" prop="nickname">
        <el-input v-model="form.nickname" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="上线周期" prop="effectiveTime">
        <el-date-picker
          v-model="form.effectiveTime"
          type="datetimerange"
          value-format="YYYY-MM-DD HH:mm:ss"
          format="YYYY-MM-DD HH:mm"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
          @blur="handleDateChange"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="星球故事：" prop="story">
        <el-input
          v-model="form.story"
          type="textarea"
          style="width: 800px"
          :rows="8"
        ></el-input>
      </el-form-item>
      <el-form-item label="星球描述：" prop="describe">
        <el-input
          v-model="form.describe"
          type="textarea"
          style="width: 800px"
          :rows="8"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('starForm')">立即创建</el-button>
        <el-button @click="jumpToManage">取消创建</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { reqCreateStar } from '@/api/createstar'

const router = useRouter()

const form = reactive({
  describe: '',
  nickname: '',
  story: '',
  ipDescribe: '1',
  ipNickname: '1',
  ipStory: '1',
  effectiveTime: [],
  startTime: '',
  endTime: '',
})

const rules = reactive({
  nickname: [
    { required: true, message: '请输入星球昵称', trigger: 'blur' },
    { min: 1, max: 16, message: '昵称上限为16个字符', trigger: 'blur' },
  ],
  story: [
    { required: true, message: '请输入星球故事', trigger: 'change' },
  ],
  describe: [
    { required: true, message: '请输入星球描述', trigger: 'change' },
  ],
  effectiveTime: [
    { validator: validateEffectiveTime, trigger: 'change' }
  ],
})

const pickerOptions = reactive({
  disabledDate(time) {
    return time.getTime() < Date.now() - 1000 * 60 * 60 * 24
  }
})

const starForm = ref(null)

const validateEffectiveTime = (rule, value, callback) => {
  if (value && value.length >= 2) {
    callback()
  } else {
    callback(new Error('请选择时间范围'))
  }
}

const handleDateChange = () => {
  form.startTime = form.effectiveTime[0]
  form.endTime = form.effectiveTime[1]
}

const submitForm = () => {
  starForm.value.validate((valid) => {
    if (valid) {
      ElMessageBox.confirm('此操作将提交星球信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      .then(() => {
        submitStar()
        ElMessage({
          type: 'success',
          message: '创建成功!',
        })
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '已取消创建',
        })
      })
    }
  })
}

const submitStar = async () => {
  try {
    await reqCreateStar(form)
    starForm.value.resetFields()
  } catch (e) {
    console.log(e)
  }
}

const jumpToManage = () => {
  router.push('/manage/starmanage')
}
</script>

<style scoped>
.line {
  text-align: center;
}

::v-deep .el-textarea__inner {
  resize: none;
}
</style>
