import { setupLayouts } from 'virtual:layout'
import { createRouter, createWebHistory } from 'vue-router'
import { setupAuthGuard } from '@/router/guard/auth'
import { setupTitleGuard } from './guard/title'
import { routes } from './static-router'

export const router = createRouter({
  routes: setupLayouts(routes),
  history: createWebHistory(),
})

setupAuthGuard(router)
setupTitleGuard(router)
