import type { Router, RouteRecordRaw } from 'vue-router'

import { omit } from 'es-toolkit'
import { setupLayouts } from 'virtual:layout'
import { routes } from 'vue-router/auto-routes'

import { NOT_FOUND_NAME, notFoundRoute, ROUTE_NAME } from '@/router/constant'
import { filterRoutesByAccess } from '@/router/guard-menu'

let routeAccessKey: string | null = null
const LOGIN_PATH = '/login'
const AUTH_HOME_PATH = '/admin'

export function setupAuthGuard(router: Router) {
  const authorization = useAuthorization()
  router.beforeEach(async to => {
    const userStore = useUserStore()
    const isAuthenticated = Boolean(authorization.value)

    if (!authorization.value) {
      userStore.logout()
    } else if (userStore.token !== authorization.value) {
      userStore.setToken(authorization.value)
    }

    const isLoginRoute = to.path === LOGIN_PATH
    if (isAuthenticated && (!userStore.userInfo || !userStore.menusLoaded)) {
      const { userInfo } = await userStore.ensureAuthContext()
      if (!userInfo && userStore.token) {
        userStore.logout()
        return {
          path: LOGIN_PATH,
          replace: true,
        }
      }
    }

    if (
      syncAccessibleRoutes(
        router,
        filterRoutesByAccess(setupLayouts(routes), userStore.menus, isAuthenticated),
        createRouteAccessKey(isAuthenticated, userStore.menus),
      )
    ) {
      // @ts-expect-error this is a hack to trigger the router to re-evaluate the routes
      if (to && to.name && to.name === NOT_FOUND_NAME) {
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

    if (!isAuthenticated) {
      if (!isLoginRoute) {
        return {
          path: LOGIN_PATH,
          replace: true,
        }
      }
      return
    }

    if (isLoginRoute) {
      return {
        path: AUTH_HOME_PATH,
        replace: true,
      }
    }
  })
}

function syncAccessibleRoutes(router: Router, children: RouteRecordRaw[], nextKey: string) {
  if (routeAccessKey === nextKey && router.hasRoute(ROUTE_NAME)) {
    return false
  }

  if (router.hasRoute(ROUTE_NAME)) {
    router.removeRoute(ROUTE_NAME)
  }
  if (router.hasRoute(NOT_FOUND_NAME)) {
    router.removeRoute(NOT_FOUND_NAME)
  }

  const route: RouteRecordRaw = {
    path: '/ROOT_ROUTE',
    name: ROUTE_NAME,
    redirect: '',
    children,
  }

  router.addRoute(route)
  router.addRoute(notFoundRoute)
  routeAccessKey = nextKey

  return true
}

function createRouteAccessKey(
  isAuthenticated: boolean,
  menus: readonly { routePath: string | null }[],
) {
  if (!isAuthenticated) {
    return 'public'
  }

  const routePaths = menus
    .map(menu => menu.routePath)
    .filter((routePath): routePath is string => Boolean(routePath))
    .sort()

  return `auth:${routePaths.join('|')}`
}
