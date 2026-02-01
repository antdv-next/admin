import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import { setupTitleGuard } from './guard/title'

export const router = createRouter({
  routes,
  history: createWebHistory(),
})

setupTitleGuard(router)
