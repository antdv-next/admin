import type { Router, RouteRecordRaw } from 'vue-router'

import { omit } from 'es-toolkit'
import { setupLayouts } from 'virtual:layout'
import { routes } from 'vue-router/auto-routes'

import { NOT_FOUND_NAME, notFoundRoute, ROUTE_NAME } from '@/router/constant'

let hasRoute = false
const LOGIN_PATH = '/login'
const AUTH_HOME_PATH = '/admin'

export function setupAuthGuard(router: Router) {
  const authorization = useAuthorization()
  router.beforeEach(async (to) => {
    const userStore = useUserStore()

    if (!authorization.value) {
      userStore.logout()
    } else if (userStore.token !== authorization.value) {
      userStore.setToken(authorization.value)
    }

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

    const isLoginRoute = to.path === LOGIN_PATH
    if (!authorization.value) {
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

    if (!userStore.userInfo && !userStore.userInfoLoading) {
      void userStore.ensureUserInfo().then((userInfo) => {
        if (userInfo || !userStore.token) {
          return
        }

        userStore.logout()
        if (router.currentRoute.value.path !== LOGIN_PATH) {
          void router.replace(LOGIN_PATH)
        }
      })
    }
  })
}
