<!--
 * @Description: Stay hungry，Stay foolish
 * @Author: Huccct
 * @Date: 2023-05-19 17:38:16
 * @LastEditors: Huccct
 * @LastEditTime: 2023-05-23 22:02:06
-->
<script setup lang="ts">
import { User, Lock, Warning } from '@element-plus/icons-vue'
import { Ref, computed, reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
import { getTime } from '@/utils/time'
import useUserStore from '@/store/modules/user'
import Identify from '@/components/VerifyCode/index.vue'
// VerifyCode import

let $router = useRouter()
let $route = useRoute()
let loading = ref(false)

const identifyCode = ref('1234')
const identifyCodes = ref('1234567890abcdefjhijklinopqrsduvwxyz')

// 重置验证码
const refreshCode = () => {
  identifyCode.value = ''
  makeCode(identifyCode, 4)
}

const makeCode = (o: Ref<any>, l: number) => {
  for (let i = 0; i < l; i++) {
    identifyCode.value +=
      identifyCodes.value[randomNum(0, identifyCodes.value.length)]
  }
}

const randomNum = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min)
}

let useStore = useUserStore()
let loginForms = ref()

const loginForm = reactive({
  username: 'admin',
  password: '123456',
  verifyCode: '1234',
})

const validatorUsername = (rule: any, value: any, callback: any) => {
  if (value.length === 0) {
    callback(new Error('请输入账号'))
  } else {
    callback()
  }
}

const validatorPassword = (rule: any, value: any, callback: any) => {
  if (value.length === 0) {
    callback(new Error('请输入密码'))
  } else if (value.length < 6 || value.length > 16) {
    callback(new Error('密码应为6~16位的任意组合'))
  } else {
    callback()
  }
}

const validatorVerifyCode = (rule: any, value: any, callback: any) => {
  console.log(value, identifyCode.value)

  if (value.length === 0) {
    callback(new Error('请输入验证码'))
  } else if (value.length < 4) {
    callback(new Error('请输入正确的验证码'))
  } else if (identifyCode.value !== value) {
    callback(new Error('请输入正确的验证码'))
  } else if (identifyCode.value === value) {
    callback()
  }
}

const login = async () => {
  await loginForms.value.validate()
  loading.value = true
  try {
    await useStore.userLogin(loginForm)
    let redirect: string = $route.query.redirect as string
    $router.push({ path: redirect || '/' })
    $router.push('/')
    ElNotification({
      type: 'success',
      message: '登陆成功',
      title: `Hi, ${getTime()}好`,
    })
    loading.value = false
  } catch (error) {
    loading.value = false
    ElNotification({
      type: 'error',
      message: (error as Error).message,
    })
  }
}

const rules = {
  username: [
    {
      trigger: 'change',
      validator: validatorUsername,
    },
  ],
  password: [
    {
      trigger: 'change',
      validator: validatorPassword,
    },
  ],
  verifyCode: [
    {
      trigger: 'blur',
      validator: validatorVerifyCode,
    },
  ],
}

// ../../assets/images/0050.png
</script>
<template>
  <div class="login_container">
    <el-card class="login_form">
      <div class="title-container-top">
        <img src="@/assets/images/login/title.png" />
      </div>
      <div class="title-container">
        <div class="title1">开放平台</div>
        <!-- <div
            v-if="
                domain != 'admintest.kmeta.world' &&
                domain != 'admin.kmeta.world'
              "
              class="title2"
            >
              企业管理后台
            </div>
            <div v-else class="title2">系统管理后台</div> -->
        <div class="title2">系统管理后台</div>
      </div>
      <el-form :model="loginForm" :rules="rules" ref="loginForms">
        <el-form-item prop="username" style="margin-top: 25px">
          <el-input
            :prefix-icon="User"
            v-model="loginForm.username"
            clearable
            placeholder="Username"
            size="large"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password" style="margin-top: 25px">
          <el-input
            type="password"
            :prefix-icon="Lock"
            show-password
            v-model="loginForm.password"
            size="large"
            placeholder="Password"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item prop="verifyCode" style="margin-top: 25px">
          <el-input
            :prefix-icon="Warning"
            show-password
            v-model="loginForm.verifyCode"
            placeholder="VerifyCode"
            size="large"
            maxlength="4"
          >
            <template #append>
              <Identify :identifyCode="identifyCode" @click="refreshCode" />
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <el-form-item>
        <el-button
          :loading="loading"
          class="loginbtn"
          type="primary"
          size="default"
          @click="login"
        >
          登录
        </el-button>
      </el-form-item>
    </el-card>
  </div>
</template>
<style lang="scss" scoped>
.login_container {
  min-height: 100%;
  height: 100vh;
  width: 100%;
  background: url('@/assets/images/login/bac.png');
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  .login_form {
    // position: relative;
    width: 500px;
    height: 720px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: url('@/assets/images/login/bac2.png') no-repeat;
    background-size: cover;
    background-position: center;
    h1 {
      background: linear-gradient(to right, blue, rgb(35, 60, 70));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-size: 40px;
      text-align: center;
      font-weight: 700;
      margin-bottom: 40px;
      margin-top: -10px;
    }
    .title-container-top {
      width: 242px;
      height: 57px;
      // background-color: #73bf30;
    }
    .title-container {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      width: 119px;
      height: 94px;
      margin-top: 15px;
      margin-bottom: 42px;
      .title1 {
        // width: 95px;
        height: 24px;
        font-size: 24px;
        color: #ffffffff;
        font-weight: bold;
      }
      .title2 {
        width: 160px;
        height: 20px;
        font-size: 20px;
        color: #d5dde0ff;
        margin-top: 50px;
        font-weight: bold;
      }
    }
    .loginbtn {
      background: linear-gradient(to right, #5924ff, #20dfff);
      height: 50px;
      width: 240px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 10px;
      font-size: 18px;
      color: #ffffff;
      font-weight: bold;
    }
    .el-input {
      height: 50px;
      // width: 380px;

      width: 85%;
    }
    .login_btn {
      width: 100%;
    }
  }
}
.el-card {
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  border: none;
}
:deep(.el-input-group__append, .el-input-group__prepend) {
  padding: 0;
}
</style>
