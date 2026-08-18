import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vite-plus/test'
import type { MenuInfo } from '@/api/menu'
import { AUTH_DEFAULT_PATH } from '@/constants/router'
import { resolveNextActivePath, useAdminTabsStore } from '../tabs'
import type { AdminTabItem } from '../tabs'

function createTab(partial: Partial<AdminTabItem> & Pick<AdminTabItem, 'path'>): AdminTabItem {
  return {
    affix: partial.affix ?? false,
    fullPath: partial.fullPath ?? partial.path,
    keepAliveName: partial.keepAliveName,
    path: partial.path,
    title: partial.title ?? partial.path,
  }
}

function createMenu(partial: Partial<MenuInfo> & Pick<MenuInfo, 'id' | 'title'>): MenuInfo {
  return {
    affix: 0,
    keepAlive: 0,
    path: null,
    ...partial,
  } as MenuInfo
}

function createRoute(options: {
  componentName?: string
  fullPath?: string
  matchedPath?: string
  path: string
  title?: string
}) {
  return {
    fullPath: options.fullPath ?? options.path,
    matched: [
      {
        components: {
          default: options.componentName ? { name: options.componentName } : {},
        },
        path: options.matchedPath ?? options.path,
      },
    ],
    meta: options.title ? { title: options.title } : {},
    path: options.path,
  } as never
}

describe('resolveNextActivePath', () => {
  const tabs = [
    createTab({ path: '/a', fullPath: '/a?x=1' }),
    createTab({ path: '/b' }),
    createTab({ path: '/c' }),
  ]

  it('returns undefined when closing an inactive tab', () => {
    expect(resolveNextActivePath(tabs, '/a', '/b')).toBeUndefined()
  })

  it('prefers the right neighbor and falls back to the left neighbor', () => {
    expect(resolveNextActivePath(tabs, '/b', '/b')).toBe('/c')
    expect(resolveNextActivePath(tabs, '/c', '/c')).toBe('/b')
  })

  it('falls back to the auth default path when no tab is left', () => {
    expect(resolveNextActivePath([createTab({ path: '/a' })], '/a', '/a')).toBe(AUTH_DEFAULT_PATH)
  })
})

describe('useAdminTabsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('seeds affix tabs from menus and records the active route', () => {
    const store = useAdminTabsStore()
    const menus = [
      createMenu({ id: '1', title: '概览', path: '/admin/overview', affix: 1 }),
      createMenu({ id: '2', title: '用户管理', path: '/admin/user', keepAlive: 1 }),
    ]

    store.syncActiveTab(createRoute({ path: '/admin/user', componentName: 'AdminUserPage' }), menus)

    expect(store.tabs).toMatchObject([
      { affix: true, path: '/admin/overview', title: '概览' },
      {
        affix: false,
        keepAliveName: 'AdminUserPage',
        path: '/admin/user',
        title: '用户管理',
      },
    ])
    expect(store.keepAliveNames).toEqual(['AdminUserPage'])
  })

  it('keeps one tab per path and tracks the latest full path', () => {
    const store = useAdminTabsStore()
    const menus = [createMenu({ id: '1', title: '用户管理', path: '/admin/user' })]

    store.syncActiveTab(createRoute({ path: '/admin/user' }), menus)
    store.syncActiveTab(createRoute({ path: '/admin/user', fullPath: '/admin/user?page=2' }), menus)

    expect(store.tabs).toHaveLength(1)
    expect(store.tabs[0]).toMatchObject({ fullPath: '/admin/user?page=2', path: '/admin/user' })
  })

  it('falls back to route meta title and path for routes without menus', () => {
    const store = useAdminTabsStore()

    store.syncActiveTab(createRoute({ path: '/admin/profile', title: '个人中心' }), [])
    store.syncActiveTab(createRoute({ path: '/admin/unknown' }), [])

    expect(store.tabs).toMatchObject([
      { path: '/admin/profile', title: '个人中心' },
      { path: '/admin/unknown', title: '/admin/unknown' },
    ])
  })

  it('skips catch-all fallback routes such as the admin 404 page', () => {
    const store = useAdminTabsStore()

    store.syncActiveTab(
      createRoute({ path: '/admin/missing', matchedPath: '/admin/:path(.*)' }),
      [],
    )

    expect(store.tabs).toHaveLength(0)
  })

  it('never closes affix tabs and navigates to a neighbor when closing the active tab', () => {
    const store = useAdminTabsStore()
    const menus = [createMenu({ id: '1', title: '概览', path: '/admin/overview', affix: 1 })]

    store.syncActiveTab(createRoute({ path: '/admin/user' }), menus)
    store.syncActiveTab(createRoute({ path: '/admin/role' }), menus)

    expect(store.closeTab('/admin/overview', '/admin/role')).toBeUndefined()
    expect(store.tabs).toHaveLength(3)

    expect(store.closeTab('/admin/role', '/admin/role')).toBe('/admin/user')
    expect(store.tabs.map(tab => tab.path)).toEqual(['/admin/overview', '/admin/user'])
  })

  it('keeps affix tabs when closing others or all tabs', () => {
    const store = useAdminTabsStore()
    const menus = [createMenu({ id: '1', title: '概览', path: '/admin/overview', affix: 1 })]

    store.syncActiveTab(createRoute({ path: '/admin/user' }), menus)
    store.syncActiveTab(createRoute({ path: '/admin/role' }), menus)
    store.closeOtherTabs('/admin/role')
    expect(store.tabs.map(tab => tab.path)).toEqual(['/admin/overview', '/admin/role'])

    expect(store.closeAllTabs('/admin/role')).toBe('/admin/overview')
    expect(store.tabs.map(tab => tab.path)).toEqual(['/admin/overview'])
    expect(store.closeAllTabs('/admin/overview')).toBeUndefined()
  })

  it('bumps the refresh version per tab path', () => {
    const store = useAdminTabsStore()

    expect(store.getRefreshVersion('/admin/user')).toBe(0)
    store.refreshTab('/admin/user')
    expect(store.getRefreshVersion('/admin/user')).toBe(1)
    expect(store.getRefreshVersion('/admin/role')).toBe(0)
  })
})
