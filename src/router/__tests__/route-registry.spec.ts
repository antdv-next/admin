import type { RouteRecordRaw } from 'vue-router'
import { describe, expect, it } from 'vite-plus/test'
import {
  createRoutePathChecker,
  isCatchAllRecordPath,
  isRouteMissing,
} from '@/router/route-registry'

const PageComponent = { render: () => null }

const sampleRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    children: [
      {
        path: 'system/user',
        component: PageComponent,
      },
      {
        path: 'detail/:id',
        component: PageComponent,
      },
      {
        path: ':path(.*)',
        component: PageComponent,
      },
    ],
  },
  {
    path: '/home',
    component: PageComponent,
  },
]

describe('isCatchAllRecordPath', () => {
  it('detects catch-all record paths', () => {
    expect(isCatchAllRecordPath('/:pathMatch(.*)*')).toBe(true)
    expect(isCatchAllRecordPath('/admin/:path(.*)')).toBe(true)
  })

  it('does not treat normal params as catch-all', () => {
    expect(isCatchAllRecordPath('/admin/detail/:id')).toBe(false)
    expect(isCatchAllRecordPath('/admin/system/user')).toBe(false)
  })
})

describe('isRouteMissing', () => {
  it('treats an unmatched location as missing', () => {
    expect(isRouteMissing({ matched: [] })).toBe(true)
  })

  it('treats a catch-all match as missing and a real page as found', () => {
    expect(isRouteMissing({ matched: [{ path: '/admin/:path(.*)' }] as never })).toBe(true)
    expect(isRouteMissing({ matched: [{ path: '/admin/system/user' }] as never })).toBe(false)
  })
})

describe('createRoutePathChecker', () => {
  const hasRoutePath = createRoutePathChecker(sampleRoutes)

  it('finds real pages including dynamic params', () => {
    expect(hasRoutePath('/home')).toBe(true)
    expect(hasRoutePath('/admin/system/user')).toBe(true)
    expect(hasRoutePath('/admin/detail/1')).toBe(true)
  })

  it('does not treat catch-all fallbacks as real pages', () => {
    expect(hasRoutePath('/admin/anything-else')).toBe(false)
    expect(hasRoutePath('/missing')).toBe(false)
  })
})
