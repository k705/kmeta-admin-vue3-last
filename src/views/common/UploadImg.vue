<template>
  <div class="cl">
    <el-upload
      v-loading="loadingFlag"
      :disabled="isDisabled"
      action
      accept="image/*"
      class="avatar-uploader"
      :auto-upload="false"
      :on-change="uploadFile"
      :show-file-list="false"
    >
      <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
      <!-- <i ></i> -->
    </el-upload>
  </div>
</template>

<script setup>
const props = defineProps({
  isDisabled: {
    type: Boolean,
    default: false,
  },
  module: {
    type: String,
    default: null,
  },
  getWidthHeight: {
    type: Boolean,
    default: false,
  },
})
import { ref } from 'vue'
import { reqUpload } from '@/api/brand'
import { ElNotification } from 'element-plus'
const imgUrl = ref('')
const loadingFlag = ref(false)
// 用于发射事件
const emit = defineEmits(['get-url'])

const uploadFile = (e) => {
  // console.log(e)
  const file = e.raw
  const size = file.size / 1024 / 1024 / 2
  if (
    !(
      file.type === 'image/png' ||
      file.type === 'image/gif' ||
      file.type === 'image/jpg' ||
      file.type === 'image/jpeg'
    )
  ) {
    ElNotification({
      title: '警告',
      message: '请上传格式为image/png, image/gif, image/jpg, image/jpeg的图片',
      type: 'warning',
    })
    return
  } else if (size > 10) {
    ElNotification({
      title: '警告',
      message: '图片大小必须小于10M',
      type: 'warning',
    })
    return
  } else {
    let formData = new FormData()
    formData.append('file', file)
    formData.append('getWidthHeight', props.getWidthHeight)
    if (props.module) {
      formData.append('module', props.module)
    }
    loadingFlag.value = true
    reqUpload(formData)
      .then((res) => {
        // this.$emit('get-url', res.data.data);
        emit('get-url', res.data) // 触发 get-url 事件，并传递数据
        imgUrl.value = res.data
        console.log(res.data, 'imgUrl.value')
        loadingFlag.value = false
      })
      .catch((err) => {
        loadingFlag.value = false
      })
  }
}
</script>

<style lang="scss" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.remove {
  font-size: 20px;
  position: absolute;
  top: -9px;
  right: -9px;
  color: #000 !important;
}
</style>
<style>
.el-upload {
  border: 1px dashed #d9d9d9;
}
.cl .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px !important;
  height: 120px !important;
  line-height: 120px;
  text-align: center;
}
.cl .avatar {
  width: 120px !important;
  height: 120px !important;
  display: block;
}
.cl > .avatar-uploader > .el-upload {
  width: 120px !important;
  height: 120px !important;
}
.el-loading-mask {
  width: 120px !important;
  height: 120px !important;
}
</style>
