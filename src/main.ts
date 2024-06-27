/*
 * @Description: Stay hungry，Stay foolish
 * @Author: Huccct
 * @Date: 2023-05-17 14:32:02
 * @LastEditors: Huccct
 * @LastEditTime: 2023-05-22 22:08:06
 */
import { createApp } from 'vue'
import App from '@/App.vue'
import 'default-passive-events'
// svg插件需要配置代码
import 'virtual:svg-icons-register'
// 引入自定义插件对象：注册整个项目全局组件
import globalComponent from '@/components/index'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/el-notification.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
// import 'element-plus/lib/theme-chalk/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import UploadImg from '@/views/common/UploadImg.vue'

import '@/styles/index.scss'
import router from './router'
import pinia from './store'
import './permission'
import { isHasButton } from './directive/has'

const app = createApp(App)

export const injectIcons = (app: App) => {
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
}
app.component('UploadImg', UploadImg)

isHasButton(app)
// injectIcons(app)
app.use(globalComponent)
app.use(router)
app.use(pinia)
app.mount('#app')
