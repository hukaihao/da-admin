import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 path: '/example',
 component: Layout,
 redirect: '/example/table',
 name: 'Example',
 meta: { title: '例子', icon: 'example' },
 children: [
 {
   path: 'table',
   name: 'Table',
   component: () => import('@/views/table/index'),
   meta: { title: 'Table', icon: 'table' }
 },
 {
   path: 'tree',
   name: 'Tree',
   component: () => import('@/views/tree/index'),
   meta: { title: 'Tree', icon: 'tree' }
 }
 ]
 }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    name: '首页',
    // hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      name: 'dashboard',
      meta: { title: '首页', icon: 'dashboard', noCache: true }
    }]
  },
  {
    path: '/input',
    component: Layout,
    children: [
      {
        path: 'input',
        name: 'input',
        component: () => import('@/views/input/index'),
        meta: { title: '数据录入', icon: 'input' }
      }
    ]
  },
  {
    path: '/excel',
    component: Layout,
    redirect: '/excel/exportExcel',
    name: 'excel',
    meta: { title: '数据处理', icon: 'excel' },
    children: [
      {
        path: 'exportExcel',
        name: 'exportExcel',
        component: () => import('@/views/excel/exportExcel'),
        meta: { title: '全量导出', icon: 'download' }
      },
      {
        path: 'selectExcel',
        name: 'selectExcel',
        component: () => import('@/views/excel/selectExcel'),
        meta: { title: '部分导出', icon: 'download' }
      },
      {
        path: 'uploadExcel',
        name: 'uploadExcel',
        component: () => import('@/views/excel/uploadExcel'),
        meta: { title: '上载', icon: 'upload' }
      }
    ]
  },
  {
    path: '/product',
    component: Layout,
    redirect: '/product/analysis',
    name: 'product',
    meta: { title: '产品管理', icon: 'excel' },
    children: [
      {
        path: 'analysis',
        name: 'analysis',
        component: () => import('@/views/product/analysis'),
        meta: { title: '分析结果', icon: 'download' }
      },
      {
        path: 'upload',
        name: 'upload',
        component: () => import('@/views/product/upload'),
        meta: { title: '上载', icon: 'upload' }
      },
      {
        path: 'download',
        name: 'download',
        component: () => import('@/views/product/download'),
        meta: { title: '下载', icon: 'download' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    name: '首页',
    // hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      name: 'dashboard',
      meta: { title: '首页', icon: 'dashboard', noCache: true }
    }]
  },
  {
    path: '/input',
    component: Layout,
    children: [
      {
        path: 'input',
        name: 'input',
        component: () => import('@/views/input/index'),
        meta: { title: '数据录入', icon: 'input' }
      }
    ]
  },
  {
    path: '/excel',
    component: Layout,
    redirect: '/excel/exportExcel',
    name: 'excel',
    meta: { title: '数据处理', icon: 'excel' },
    children: [
      {
        path: 'exportExcel',
        name: 'exportExcel',
        component: () => import('@/views/excel/exportExcel'),
        meta: { title: '全量导出', icon: 'download' }
      },
      {
        path: 'selectExcel',
        name: 'selectExcel',
        component: () => import('@/views/excel/selectExcel'),
        meta: { title: '部分导出', icon: 'download' }
      },
      {
        path: 'uploadExcel',
        name: 'uploadExcel',
        component: () => import('@/views/excel/uploadExcel'),
        meta: { title: '上载', icon: 'upload' }
      }
    ]
  },
  {
    path: '/product',
    component: Layout,
    redirect: '/product/analysis',
    name: 'excel',
    meta: { title: '产品管理', icon: 'excel' },
    children: [
      {
        path: 'analysis',
        name: 'analysis',
        component: () => import('@/views/product/analysis'),
        meta: { title: '全量导出', icon: 'download' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]
