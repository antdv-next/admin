import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import { setupAuthGuard } from '@/router/guard/auth.ts'
import { setupTitleGuard } from './guard/title'

export const router = createRouter({
  routes,
  history: createWebHistory(),
})

setupAuthGuard(router)
setupTitleGuard(router)
