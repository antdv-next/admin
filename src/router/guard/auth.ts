import type { Router, RouteRecordRaw } from 'vue-router'
import { omit } from 'es-toolkit'
import { setupLayouts } from 'virtual:layout'
import { routes } from 'vue-router/auto-routes'
import { LOGIN_PATH } from '@/constants/router'
import { NOT_FOUND_NAME, notFoundRoute, ROUTE_NAME } from '@/router/constant'
import { filterRoutesByAccess } from '@/router/guard-menu'
import { resolveAuthGuardRedirect } from '@/router/redirect'

let routeAccessKey: string | null = null

export function setupAuthGuard(router: Router) {
  const authorization = useAuthorization()
  router.beforeEach(async to => {
    const userStore = useUserStore()
    const isAuthenticated = Boolean(authorization.value)
    const isPublicRoute = to.matched.some(record => record.meta?.access?.mode === 'public')

    if (!authorization.value) {
      userStore.logout()
    } else if (userStore.token !== authorization.value) {
      userStore.setToken(authorization.value)
    }

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
      const redirectPath = resolveAuthGuardRedirect({
        isAuthenticated,
        isPublicRoute,
        toPath: to.path,
      })
      if (redirectPath) {
        return {
          path: redirectPath,
          replace: true,
        }
      }
      return
    }

    const redirectPath = resolveAuthGuardRedirect({
      isAuthenticated,
      isPublicRoute,
      toPath: to.path,
    })
    if (redirectPath) {
      return {
        path: redirectPath,
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

function createRouteAccessKey(isAuthenticated: boolean, menus: readonly { path: string | null }[]) {
  if (!isAuthenticated) {
    return 'public'
  }

  const routePaths = menus
    .map(menu => menu.path)
    .filter((path): path is string => Boolean(path))
    .sort()

  return `auth:${routePaths.join('|')}`
}
