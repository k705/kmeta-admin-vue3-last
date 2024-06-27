/*
 * @Description: Stay hungry，Stay foolish
 * @Author: Huccct
 * @Date: 2023-05-22 22:06:16
 * @LastEditors: Huccct
 * @LastEditTime: 2023-06-02 10:45:52
 */
import router from '@/router'

import setting from './setting'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import pinia from './store'
import useUserStore from './store/modules/user'
nprogress.configure({ showSpinner: false })
let userStore = useUserStore(pinia)
// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  document.title = to.meta.title + ` | ${setting.title}`
  nprogress.start()
  let token = userStore.token
  let username = userStore.username
  let dynamicRoutes = userStore.dynamicRoutes
  let menuRoutes = userStore.menuRoutes

  if (token) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      if (dynamicRoutes.length > 0) {
        // console.log(router.options, 'options')
        next()
      } else {
        try {
          await userStore.userInfo()
          // console.log(router.options, 'options')

          next({ ...to })
          // console.log(222)
        } catch (error) {
          console.log(error, 'error')
          await userStore.userLogout()
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else {
    if (to.path == '/login') {
      next()
    } else {
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
})
// 全局后置守卫

router.afterEach((route) => {
  nprogress.done()
})
