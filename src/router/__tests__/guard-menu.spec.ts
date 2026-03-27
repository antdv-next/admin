import type { RouteRecordRaw } from 'vue-router'

import { describe, expect, it } from 'vite-plus/test'

import type { MenuInfo } from '@/api/menu'

import { filterRoutesByAccess, filterRoutesByMenuAccess } from '@/router/guard-menu'

function createRoute<T>(route: T): RouteRecordRaw {
  return route as RouteRecordRaw
}

function createMenu(routePath: string): MenuInfo {
  return {
    id: routePath,
    menuName: routePath,
    menuCode: routePath,
    routePath,
  } as MenuInfo
}

describe('filterRoutesByMenuAccess', () => {
  it('filters menu routes by backend menus and keeps public or login routes', () => {
    const routes: RouteRecordRaw[] = [
      createRoute({
        path: '/login',
        name: 'login',
        meta: {
          access: {
            mode: 'public',
          },
        },
      }),
      createRoute({
        path: '/profile',
        name: 'profile',
        meta: {
          access: {
            mode: 'login',
          },
        },
      }),
      createRoute({
        path: '/user',
        name: 'user',
      }),
      createRoute({
        path: '/audit',
        name: 'audit',
      }),
    ]

    expect(filterRoutesByMenuAccess(routes, [createMenu('/user')])).toEqual([
      {
        path: '/login',
        name: 'login',
        meta: {
          access: {
            mode: 'public',
          },
        },
      },
      {
        path: '/profile',
        name: 'profile',
        meta: {
          access: {
            mode: 'login',
          },
        },
      },
      {
        path: '/user',
        name: 'user',
      },
    ])
  })

  it('supports inherit access from another route path', () => {
    const routes: RouteRecordRaw[] = [
      createRoute({
        path: '/user',
        name: 'user',
      }),
      createRoute({
        path: '/user/detail',
        name: 'user-detail',
        meta: {
          access: {
            mode: 'inherit',
            from: '/user',
          },
        },
      }),
      createRoute({
        path: '/report',
        name: 'report',
        meta: {
          access: {
            mode: 'inherit',
            from: '/missing',
          },
        },
      }),
    ]

    expect(filterRoutesByMenuAccess(routes, [createMenu('/user')])).toEqual([
      {
        path: '/user',
        name: 'user',
      },
      {
        path: '/user/detail',
        name: 'user-detail',
        meta: {
          access: {
            mode: 'inherit',
            from: '/user',
          },
        },
      },
    ])
  })

  it('keeps parent routes when they still contain accessible children', () => {
    const routes: RouteRecordRaw[] = [
      createRoute({
        path: '/system',
        name: 'system',
        children: [
          createRoute({
            path: 'user',
            name: 'system-user',
          }),
          createRoute({
            path: 'role',
            name: 'system-role',
          }),
        ],
      }),
    ]

    expect(filterRoutesByMenuAccess(routes, [createMenu('/system/user')])).toEqual([
      {
        path: '/system',
        name: 'system',
        children: [
          {
            path: 'user',
            name: 'system-user',
          },
        ],
      },
    ])
  })
})

describe('filterRoutesByAccess', () => {
  it('keeps only public routes when user is not authenticated', () => {
    const routes: RouteRecordRaw[] = [
      createRoute({
        path: '/login',
        name: 'login',
        meta: {
          access: {
            mode: 'public',
          },
        },
      }),
      createRoute({
        path: '/landing',
        name: 'landing',
        meta: {
          access: {
            mode: 'inherit',
            from: '/login',
          },
        },
      }),
      createRoute({
        path: '/profile',
        name: 'profile',
        meta: {
          access: {
            mode: 'login',
          },
        },
      }),
      createRoute({
        path: '/user',
        name: 'user',
      }),
    ]

    expect(filterRoutesByAccess(routes, [], false)).toEqual([
      {
        path: '/login',
        name: 'login',
        meta: {
          access: {
            mode: 'public',
          },
        },
      },
      {
        path: '/landing',
        name: 'landing',
        meta: {
          access: {
            mode: 'inherit',
            from: '/login',
          },
        },
      },
    ])
  })
})
