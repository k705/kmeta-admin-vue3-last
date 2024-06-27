/*
 * @Description: Stay hungry，Stay foolish
 * @Author: Huccct
 * @Date: 2023-05-19 17:46:49
 * @LastEditors: Huccct
 * @LastEditTime: 2023-06-02 10:33:35
 */
export const constantRoute = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    name: 'login',
    meta: {
      title: '登录',
      hidden: true,
    },
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    meta: {
      title: '首屏',
    },
    redirect: '/home',
    children: [
      {
        path: '/home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首屏',
          hidden: false,
          icon: 'HomeFilled',
        },
      },
    ],
  },
  // {
  //   path: '/test1',
  //   component: () => import('@/layout/index.vue'),
  //   meta: {
  //     title: '首屏1',
  //   },
  //   redirect: '/test1/star',
  //   children: [
  //     {
  //       path: '/test1/star',
  //       component: () => import('@/views/test1/star/index.vue'),
  //       meta: {
  //         title: '首屏1',
  //         hidden: false,
  //         icon: 'HomeFilled',
  //       },
  //     },
  //     {
  //       path: '/test1/star1',
  //       component: () => import('@/views/test1/star1/index.vue'),
  //       meta: {
  //         title: '首屏2',
  //         hidden: true,
  //         icon: 'HomeFilled',
  //       },
  //     },
  //   ],
  // },
  {
    path: '/screen',
    component: () => import('@/views/screen/index.vue'),
    name: 'Screen',
    meta: {
      title: 'Screen',
      hidden: false,
      icon: 'Platform',
    },
  },
  {
    path: '/404',
    component: () => import('@/views/404/index.vue'),
    name: '404',
    meta: {
      title: '404',
      hidden: true,
    },
  },
]

// ？模板的动态路由
// export const asyncRoute = [
//   {
//     path: '/acl',
//     component: () => import('@/layout/index.vue'),
//     name: 'Acl',
//     meta: {
//       title: '权限管理',
//       hidden: false,
//       icon: 'Lock',
//     },
//     redirect: '/acl/user',
//     children: [
//       {
//         path: '/acl/user',
//         component: () => import('@/views/acl/user/index.vue'),
//         name: 'User',
//         meta: {
//           title: '用户管理',
//           hidden: false,
//           icon: 'User',
//         },
//       },
//       {
//         path: '/acl/role',
//         component: () => import('@/views/acl/role/index.vue'),
//         name: 'Role',
//         meta: {
//           title: '角色管理',
//           hidden: false,
//           icon: 'Avatar',
//         },
//       },
//       {
//         path: '/acl/permission',
//         component: () => import('@/views/acl/permission/index.vue'),
//         name: 'Permission',
//         meta: {
//           title: '菜单管理',
//           hidden: false,
//           icon: 'List',
//         },
//       },
//     ],
//   },
//   {
//     path: '/product',
//     component: () => import('@/layout/index.vue'),
//     name: 'Product',
//     meta: {
//       title: '商品管理',
//       hidden: false,
//       icon: 'Goods',
//     },
//     redirect: '/product/trademark',
//     children: [
//       {
//         path: '/product/trademark',
//         component: () => import('@/views/product/trademark/index.vue'),
//         name: 'Trademark',
//         meta: {
//           title: '品牌管理',
//           icon: 'ShoppingCart',
//           hidden: false,
//         },
//       },
//       {
//         path: '/product/attr',
//         component: () => import('@/views/product/attr/index.vue'),
//         name: 'Attr',
//         meta: {
//           title: '属性管理',
//           icon: 'Management',
//           hidden: false,
//         },
//       },
//       {
//         path: '/product/spu',
//         component: () => import('@/views/product/spu/index.vue'),
//         name: 'Spu',
//         meta: {
//           title: 'Spu',
//           icon: 'SetUp',
//           hidden: false,
//         },
//       },
//       {
//         path: '/product/sku',
//         component: () => import('@/views/product/sku/index.vue'),
//         name: 'Sku',
//         meta: {
//           title: 'Sku',
//           icon: 'ScaleToOriginal',
//           hidden: false,
//         },
//       },
//     ],
//   },
// ]

// 、我的动态路由
// export const asyncRoutes = [
//   // 内容管理：k星管理、k星创建
//   {
//     path: '/manage',
//     component: Layout,
//     redirect: '/manage/starmanage',
//     name: 'Manage',
//     alwaysShow: true,
//     meta: { title: '管理', icon: 'el-icon-s-help' },
//     children: [
//       {
//         path: 'starmanage',
//         name: 'Starmanage',
//         component: () => import('@/views/manage/starmanage'),
//         meta: { title: 'K星管理', icon: 'table' }
//       },

//       {
//         path: 'star',
//         name: 'Star',
//         component: () => import('@/views/manage/star'),
//         hidden: true,
//         meta: { title: '创建星球', icon: 'table' }
//       },

//     ]
//   },
//   // 资产管理：结算卡管理、奖品管理、
//   {
//     path: '/asset',
//     component: Layout,
//     redirect: '/asset/starasset',
//     name: 'Asset',
//     alwaysShow: true,
//     meta: { title: '资产管理', icon: 'el-icon-s-help' },
//     children: [
//       {
//         path: 'debitcard',
//         name: 'Debitcard',
//         component: () => import('@/views/asset/debitcard'),
//         meta: { title: '结算卡管理', icon: 'tree' }
//       },

//       {
//         path: 'prize',
//         name: 'Prize',
//         component: () => import('@/views/asset/prize'),

//         meta: { title: '奖品管理', icon: 'table' }
//       },
//     ]
//   },
//   // 运营管理：结算卡推荐管理、抽奖活动管理、banner管理、等级特权管理、审核管理、投诉管理
//   {
//     path: '/operations',
//     component: Layout,
//     redirect: '/operations/debitCardRecommended',
//     name: 'Operations',
//     meta: { title: '运营管理', icon: 'el-icon-s-help' },
//     children: [
//       {
//         path: 'debitCardRecommended',
//         name: 'DebitCardRecommended',
//         component: () => import('@/views/operations/debitCardRecommended'),
//         meta: { title: '结算卡推荐管理', icon: 'table' }
//       },
//       {
//         path: 'lottery',
//         name: 'Lottery',
//         component: () => import('@/views/operations/lottery'),
//         meta: { title: '抽奖活动管理', icon: 'table' }
//       }, {
//         path: 'banner',
//         name: 'Banner',
//         component: () => import('@/views/operations/banner'),
//         meta: { title: 'banner管理', icon: 'table' }
//       }, {
//         path: 'privileges',
//         name: 'Privileges',
//         component: () => import('@/views/operations/privileges'),
//         meta: { title: '等级特权管理', icon: 'table' }
//       },{
//         path: 'complaint',
//         name: 'Complaint',
//         component: () => import('@/views/operations/complaint'),
//         meta: { title: '投诉管理', icon: 'table' }
//       },

//     ]
//   },
//   // 审核管理
//   {
//     path: '/check',
//     component: Layout,
//     redirect: '/check/starcheck',
//     name: 'Check',
//     meta: { title: '审核管理', icon: 'el-icon-s-help' },
//     children: [
//       {
//         path: 'starcheck',
//         name: 'Starcheck',
//         component: () => import('@/views/check/starcheck'),
//         meta: { title: '星球审核', icon: 'table' }
//       },

//       {
//         path: 'brandcheck',
//         name: 'Brandcheck',
//         component: () => import('@/views/check/brandcheck'),

//         meta: { title: '企业认证审核', icon: 'table' }
//       },
//     ]
//   },
//   // 企业认证
//   {
//     path: '/certification',
//     component: Layout,
//     children: [
//       {
//         path: 'index',
//         name: 'Certification',
//         component: () => import('@/views/certification/index'),
//         meta: { title: '企业认证/年审', icon: 'form' }
//       }
//     ]
//   },
//   // 系统管理：权限管理、用户管理、角色管理、操作日志
//   {
//     path: '/system',
//     component: Layout,
//     redirect: '/system/permission',
//     name: 'System',
//     meta: { title: '系统管理', icon: 'el-icon-s-help' },
//     children: [
//       {
//         path: 'permission',
//         name: 'Permission',
//         component: () => import('@/views/system/permission'),
//         meta: { title: '权限管理', icon: 'table' }
//       },

//       {
//         path: 'user',
//         name: 'User',
//         component: () => import('@/views/system/user'),

//         meta: { title: '用户管理', icon: 'table' }
//       },
//       {
//         path: 'role',
//         name: 'Role',
//         component: () => import('@/views/system/role'),

//         meta: { title: '角色管理', icon: 'table' }
//       },
//       {
//         path: 'log',
//         name: 'Log',
//         component: () => import('@/views/system/log'),

//         meta: { title: '操作日志', icon: 'table' }
//       },

//     ]
//   },
//   // 系统配置：协议、K分池-月活、短信、K分上限、企业权限/角色、版本更新
//   {
//     path: '/sconfiguration',
//     component: Layout,
//     redirect: '/sconfiguration/permission',
//     name: 'Sconfiguration',
//     meta: { title: '系统配置', icon: 'el-icon-s-help' },
//     children: [
//       {
//         path: 'protocol',
//         name: 'Protocol',
//         component: () => import('@/views/sconfiguration/protocol'),
//         meta: { title: '协议', icon: 'table' }
//       },

//       {
//         path: 'mau',
//         name: 'Mau',
//         component: () => import('@/views/sconfiguration/mau'),

//         meta: { title: 'K分池-月活', icon: 'table' }
//       },
//       {
//         path: 'sms',
//         name: 'Sms',
//         component: () => import('@/views/sconfiguration/sms'),

//         meta: { title: '短信', icon: 'table' }
//       },
//       {
//         path: 'limit',
//         name: 'Limit',
//         component: () => import('@/views/sconfiguration/limit'),

//         meta: { title: 'K分上限', icon: 'table' }
//       },
//       {
//         path: 'businessRole',
//         name: 'BusinessRole',
//         component: () => import('@/views/sconfiguration/businessRole'),

//         meta: { title: '企业权限/角色', icon: 'table' }
//       },
//       {
//         path: 'version',
//         name: 'Version',
//         component: () => import('@/views/sconfiguration/version'),

//         meta: { title: '版本更新', icon: 'table' }
//       },

//     ]
//   },
//   // 数据看板
//   {
//     path: '/dashboard',
//     component: Layout,
//     redirect: '/dashboard/stardata',
//     name: 'dashboard',
//     alwaysShow: true,
//     meta: { title: '数据看板', icon: 'el-icon-s-help' },
//     children: [
//       {
//         path: 'stardata',
//         name: 'Stardata',
//         component: () => import('@/views/dashboard/stardata'),
//         meta: { title: 'K星数据', icon: 'table' }
//       },]
//   },
export const asyncRoutes = []
export const anyRoute = {
  path: '/:pathMatch(.*)*',
  redirect: '/404',
  name: 'Any',
  meta: {
    title: '任意路由',
    hidden: true,
  },
}
