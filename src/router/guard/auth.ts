import type { Router, RouteRecordRaw } from 'vue-router'
import { omit } from 'es-toolkit'
import { setupLayouts } from 'virtual:layout'
import { routes } from 'vue-router/auto-routes'
import { NOT_FOUND_NAME, notFoundRoute, ROUTE_NAME } from '@/router/constant'

let hasRoute = false
export function setupAuthGuard(router: Router) {
  router.beforeEach(async (to) => {
    if (!hasRoute) {
      if (router.hasRoute(NOT_FOUND_NAME)) {
        router.removeRoute(NOT_FOUND_NAME)
      }
      const route: RouteRecordRaw = {
        path: '/ROOT_ROUTE',
        name: ROUTE_NAME,
        redirect: '',
        children: setupLayouts(routes),
      }
      router.addRoute(route)
      router.addRoute(notFoundRoute)
      hasRoute = true
      // @ts-expect-error this is a hack to trigger the router to re-evaluate the routes
      if (to && to.name && to.name === NOT_FOUND_NAME) {
        // TODO: 这里需要处理一下
        return {
          ...omit(to, ['matched', 'name', 'redirectedFrom', 'params']),
          replace: true,
        }
      }
      return {
        ...to,
        replace: true,
      }
    }
  })
}
