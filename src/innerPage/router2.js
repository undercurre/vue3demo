
import { createRouter, createWebHashHistory, } from "vue-router";

const routes = [

  {
    path: '/',
    component: () => import('./Home2.vue'),

  }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes: routes
})



export default router
