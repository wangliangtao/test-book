import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'


/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    // name: '首页',
    hidden: false,
    alwaysShow: false,
    meta: {
      title: '',
      icon: 'icon_home',
      roles: []
    },
    children: [
      {
        path: '',
        component: resolve => require(['@/views/map/index'], resolve),
        name: 'map',
        meta: {
          title: '停车运营',
          icon: 'icon_home',
          affix: false
        }
      }
    ]
  },
  {
    path: '/demo',
    component: Layout,
    // name: '首页',
    hidden: false,
    alwaysShow: false,
    meta: {
      title: 'demo',
      icon: 'icon_home',
      roles: []
    },
    children: [
      {
        path: 'demo1',
        component: resolve => require(['@/views/demo/demo1'], resolve),
        name: 'demo1',
        meta: {
          title: '蜂窝',
          icon: 'icon_home',
          affix: false
        }
      },
      {
        path: 'demo2',
        component: resolve => require(['@/views/demo/demo2'], resolve),
        name: 'demo2',
        meta: {
          title: '气泡',
          icon: 'icon_home',
          affix: false
        }
      },
      {
        path: 'demo3',
        component: resolve => require(['@/views/demo/demo3'], resolve),
        name: 'demo3',
        meta: {
          title: '网格',
          icon: 'icon_home',
          affix: false
        }
      },
      {
        path: 'demo4',
        component: resolve => require(['@/views/demo/demo4'], resolve),
        name: 'demo4',
        meta: {
          title: '弹窗',
          icon: 'icon_home',
          affix: false
        }
      }
    ]
  },
  {
    path: '/marketingCenter',
    component: Layout,
    name: '营销中心',
    hidden: false,
    alwaysShow: false,
    meta: {
      title: '营销中心',
      icon: 'icon_marketing_selected',
      roles: []
    },
    children: [
      {
        path: 'redPacketManage',
        component: resolve => require(['@/views/marketingCenter/redPacketManage/index'], resolve),
        name: 'redPacketList',
        meta: { title: '红包管理' }
      },
      {
        path: 'puzzleManage',
        component: resolve => require(['@/views/marketingCenter/puzzleList/index'], resolve),
        name: 'puzzleList',
        meta: { title: '互动管理' }
      },
      {
        path: 'giftBagsManage',
        component: resolve => require(['@/views/marketingCenter/giftBagsList/index'], resolve),
        name: 'giftBagsList',
        meta: { title: '奖券管理' }
      },
      {
        path: 'goodsManage',
        component: resolve => require(['@/views/marketingCenter/goodsList/index'], resolve),
        name: 'goodsList',
        meta: { title: '商品管理' }
      },
      {
        path: 'saleManage',
        component: resolve => require(['@/views/marketingCenter/saleList/index'], resolve),
        name: 'saleList',
        meta: { title: '热销管理' }
      },
      {
        path: 'moduleManage',
        component: resolve => require(['@/views/marketingCenter/moduleList/index'], resolve),
        name: 'moduleList',
        meta: { title: '魔窗管理' }
      },
      {
        path: 'plateAuthManage',
        component: resolve => require(['@/views/marketingCenter/plateAuthList/index'], resolve),
        name: 'plateAuthList',
        meta: { title: '车牌认证管理' }
      }
    ]
  },
  {
    path: '/dataBoard',
    component: Layout,
    name: '数据中心',
    hidden: false,
    alwaysShow: false,
    meta: {
      title: '数据中心',
      icon: 'icon_data_selected',
      roles: []
    },
    children: [
      {
        path: 'paymentStatistics',
        component: resolve => require(['@/views/dataBoard/paymentStatistics/index'], resolve),
        name: 'paymentStatistics',
        meta: { title: '停车缴费统计' }
      },
      {
        path: 'faresList',
        component: resolve => require(['@/views/dataBoard/redStatistics/index'], resolve),
        name: 'redStatistics',
        meta: { title: '刷红包统计' }
      },
      {
        path: 'giftBagStatistics',
        component: resolve => require(['@/views/dataBoard/giftBagStatistics/index'], resolve),
        name: 'giftBagStatistics',
        meta: { title: '礼包抽奖统计' }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // {
  //   path: '/error',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   name: 'ErrorPages',
  //   meta: {
  //     title: 'Error Pages',
  //     icon: '404'
  //   },
  //   children: [
  //     {
  //       path: '401',
  //       component: () => import('@/views/error-page/401'),
  //       name: 'Page401',
  //       meta: { title: '401', noCache: true }
  //     },
  //     {
  //       path: '404',
  //       component: () => import('@/views/error-page/404'),
  //       name: 'Page404',
  //       meta: { title: '404', noCache: true }
  //     }
  //   ]
  // },

  // {
  //   path: '/error-log',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'log',
  //       component: () => import('@/views/error-log/index'),
  //       name: 'ErrorLog',
  //       meta: { title: 'Error Log', icon: 'bug' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
