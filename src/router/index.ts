import { createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:layout'
import { handleHotUpdate } from 'vue-router/auto-routes'
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

if (import.meta.hot) {
  handleHotUpdate(router)
}
