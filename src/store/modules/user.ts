/*
 * @Description: Stay hungry，Stay foolish
 * @Author: Huccct
 * @Date: 2023-05-20 10:58:16
 * @LastEditors: Huccct
 * @LastEditTime: 2023-06-02 11:27:32
 */
import { defineStore } from 'pinia'
import router from '@/router'
import Layout from '@/layout/index.vue' // 【新加入】引入layout
import { reqLogin, reqUserInfo, reqLogOut } from '@/api/user'
import type {
  LoginFormData,
  LoginResponseData,
  userInfoResponseData,
} from '@/api/user/type'
import type { UserState } from './types/types'
import {
  SET_TOKEN,
  GET_TOKEN,
  REMOVE_TOKEN,
  SET_USERNAME,
  GET_USERNAME,
  REMOVE_USERNAME,
  SET_AVATAR,
  GET_AVATAR,
  REMOVE_AVATAR,
} from '@/utils/token'
import { constantRoute, asyncRoutes, anyRoute } from '@/router/routes'

// @ts-ignore
import cloneDeep from 'lodash/cloneDeep'

// let dynamicRoutes = []
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    if (route.meta.roles.indexOf(roles) > -1) {
      return true
    } else {
      return false
    }
    // return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}
//这里自己写方法，作用就是向 asyncRoutes 插入路由，达到动态路由的效果
/**
 * 【新加入】后台查询的菜单数据拼装成路由格式的数据
 * @param routes
 */
export function generaMenu(routes, data) {
  const modules = import.meta.glob('/src/views/**/*.vue')
  //data挨个遍历
  data.forEach((item) => {
    //path不为空的话，就新建一个对象，装数据
    if (item.page !== '') {
      //这个就仿照目录的机构，搭建
      const menu = {
        path: item.path,
        component: () => import('/src/layout/index.vue'), //这个不用写data里面的内容，引用就行了
        redirect: item.redirect,
        children: [],
        // alwaysShow: true,
        name: item.name,

        meta: { title: item.title, icon: item.icon, hidden: item.hidden },
      }
      //遍历子标签，并加入到主目录的children中去
      item.children.forEach((childrenItem) => {
        const menu2 = {
          path: item.path + '/' + childrenItem.path,
          component: modules[`/src/views${childrenItem.component}/index.vue`],
          name: childrenItem.name,
          meta: {
            title: childrenItem.title,
            icon: childrenItem.icon,
            hidden: childrenItem.hidden,
          },
        }
        //加入到主目录的children中去
        menu.children.push(menu2)
      })
      //追加
      routes.push(menu)
    }
  })
  //把404加到最后，因为作者说  // 404 page must be placed at the end !!!
  // const menu3 = {
  //   path: '/:pathMatch(.*)*',
  //   redirect: '/404',
  //   meta: { hidden: true },
  // }
  // //追加
  // routes.push(menu3)
}

function filterAsyncRoute(routes: any, roles: any) {
  const res = []

  routes.forEach((route) => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

let useUserStore = defineStore('User', {
  // 小仓库存储数据的地方
  state: (): UserState => {
    return {
      token: GET_TOKEN()!,
      // menuRoutes: constantRoute,
      menuRoutes: [],
      dynamicRoutes: [],
      username: GET_USERNAME()!,
      avatar: GET_AVATAR()!,
      buttons: [],
    }
  },
  // 异步|逻辑的地方
  actions: {
    //用户登录方法
    async userLogin(data: LoginFormData) {
      let res: LoginResponseData = await reqLogin(data)
      // success=>token
      // error=>error.message
      if (res.code === 200) {
        this.token = res.data.accessToken as string
        this.username = res.data.username as string
        this.avatar = res.data.avatar as string
        // 持久化
        SET_TOKEN(res.data.accessToken as string)
        SET_USERNAME(res.data.username as string)
        SET_AVATAR(res.data.avatar as string)
        return 'ok'
      } else {
        return Promise.reject(new Error(res.data as string))
      }
    },
    async userInfo() {
      let res: userInfoResponseData = await reqUserInfo()
      const loadMenuData = []
      if (res.code == 200) {
        //把data的数据拷贝到loadMenuData里面
        Object.assign(loadMenuData, res.data)

        //把asyncRoutes的数据拷贝到tempAsyncRoutes里面
        const tempAsyncRoutes = Object.assign([], asyncRoutes)
        // 最最重要的，把loadMenuData追加到tempAsyncRoutes后面
        generaMenu(tempAsyncRoutes, loadMenuData)
        // const accessedRoutes = tempAsyncRoutes || []
        this.dynamicRoutes = [...constantRoute, ...tempAsyncRoutes, anyRoute]
        this.menuRoutes = [...constantRoute, ...tempAsyncRoutes, anyRoute]
        // console.log(this.dynamicRoutes, 'this.dynamicRoutes')
        this.dynamicRoutes.forEach((route) => {
          router.addRoute(route) // 动态添加路由
        })

        // let userAsyncRoute = filterAsyncRoute(
        //   cloneDeep(asyncRoute),
        //   res.data.routes,
        // )
        // this.menuRoutes = [...constantRoute, ...userAsyncRoute, anyRoute]
        // this.dynamicRoutes = [...userAsyncRoute, anyRoute] // 记录动态添加的路由
        // this.dynamicRoutes.forEach((route) => {
        //   router.addRoute(route) // 动态添加路由
        // })
        return 'ok'
      } else {
        return Promise.reject(new Error(res.message))
      }
    },
    async userLogout() {
      let res = await reqLogOut()
      if (res.code === 200) {
        this.token = null
        this.username = null
        this.avatar = null
        REMOVE_TOKEN()
        REMOVE_USERNAME()
        REMOVE_AVATAR()
        this.dynamicRoutes.forEach((route) => {
          router.removeRoute(route.name)
        })
        this.dynamicRoutes = []
        this.menuRoutes = []
      } else {
        return Promise.reject(new Error(res.message))
      }
    },
  },
  getters: {},
})

export default useUserStore
