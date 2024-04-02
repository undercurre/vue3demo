
import { createRouter, createWebHashHistory, } from "vue-router";
import { default as mapApp } from '@/map/init'

const routes = [

  {
    path: '/',
    redirect: '/showManyPop',
    component: () => import('@/views/Home.vue'),
    children: [
      {
        path: 'showManyPop',
        component: () => import('@/views/module/showManyPop.vue'),
      },
      {
        path: 'showOnlyPop',
        component: () => import('@/views/module/showOnlyPop.vue'),
      },
      {
        path: 'showModelStyle',
        component: () => import('@/views/module/showModelStyle.vue'),
      },
      {
        path: 'showHeatMap',
        component: () => import('@/views/module/showHeatMap.vue'),
      },
      {
        path: 'getRouteResult',
        component: () => import('@/views/module/getRouteResult.vue'),
      },
      {
        path: 'showMarker',
        component: () => import('@/views/module/showMarker.vue'),
      },
      {
        path: '/embedded',
        component: () => import('@/views/module/embedded.vue'),
      },
    ],
    meta: {
      keepAlive: true, // 缓存该路径，使得该路径下的ESMap地图资源缓存不被刷新
    }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/About.vue'),
    meta: {
      keepAlive: false,
    }
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes: routes
})

// 全局守卫
router.beforeEach((to, from, next) => {
  console.log(to, from)
  //如果在内嵌路由切换到其他路由，默认关闭内嵌地图场景
  if (from.fullPath === '/embedded') {
    mapApp.toggleModelMap(false)
    next()
    return
  }
  next()
});


export default router
