import { setupLayouts } from 'virtual:layout'
import { createRouter, createWebHistory } from 'vue-router'

import { setupAuthGuard } from '@/router/guard/auth'

import { setupLoadingGuard } from './guard/loading'
import { setupTitleGuard } from './guard/title'
import { routes } from './static-router'

export const router = createRouter({
  routes: setupLayouts(routes, { flatten: true }),
  history: createWebHistory(),
})
setupLoadingGuard(router)
setupAuthGuard(router)
setupTitleGuard(router)
