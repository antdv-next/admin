import { describe, expect, it } from 'vite-plus/test'
import type { MenuInfo } from '@/api/menu'
import { MENU_TYPE } from '@/constants/menu'
import { createSiderMenuState, resolveSiderOpenKeys } from '../sider-menu'

function createMenu(menu: Partial<MenuInfo> & Pick<MenuInfo, 'id' | 'title'>): MenuInfo {
  return {
    id: menu.id,
    title: menu.title,
    code: menu.code ?? menu.id,
    path: menu.path ?? null,
    parentId: menu.parentId ?? null,
    menuType: menu.menuType ?? MENU_TYPE.MENU,
    hideInMenu: menu.hideInMenu ?? 0,
    hideChildrenInMenu: menu.hideChildrenInMenu ?? 0,
    sort: menu.sort,
  } as MenuInfo
}

describe('createSiderMenuState', () => {
  it('filters hidden and button menus, builds nested items, and resolves active menu keys', () => {
    const menus: MenuInfo[] = [
      createMenu({
        id: 'workspace',
        title: '工作台',
        path: '/admin/workspace',
        menuType: MENU_TYPE.DIR,
        sort: 1,
      }),
      createMenu({
        id: 'overview',
        title: '概览',
        parentId: 'workspace',
        path: '/admin/workspace/overview',
        sort: 1,
      }),
      createMenu({
        id: 'dashboard',
        title: '控制台',
        parentId: 'workspace',
        path: '/admin/workspace/dashboard',
        sort: 2,
      }),
      createMenu({
        id: 'button',
        title: '按钮权限',
        parentId: 'workspace',
        menuType: MENU_TYPE.BUTTON,
        sort: 3,
      }),
      createMenu({
        id: 'hidden',
        title: '隐藏菜单',
        path: '/admin/hidden',
        hideInMenu: 1,
        sort: 4,
      }),
    ]

    const state = createSiderMenuState(menus, '/admin/workspace/overview')

    expect(state.items).toHaveLength(1)
    expect(state.items[0]).toMatchObject({
      key: '/admin/workspace',
      label: '工作台',
      children: [
        {
          key: '/admin/workspace/overview',
          label: '概览',
        },
        {
          key: '/admin/workspace/dashboard',
          label: '控制台',
        },
      ],
    })
    expect(state.selectedKeys).toEqual(['/admin/workspace/overview'])
    expect(state.openKeys).toEqual(['/admin/workspace'])
    expect(state.navigableKeys).toEqual(['/admin/workspace/overview', '/admin/workspace/dashboard'])
  })
})

describe('resolveSiderOpenKeys', () => {
  it('caches current open keys when sider collapses', () => {
    expect(
      resolveSiderOpenKeys({
        collapsed: true,
        previousCollapsed: false,
        currentOpenKeys: ['/admin/workspace'],
        cachedOpenKeys: [],
        routeOpenKeys: ['/admin/workspace'],
      }),
    ).toEqual({
      openKeys: [],
      cachedOpenKeys: ['/admin/workspace'],
    })
  })

  it('restores cached open keys when sider expands', () => {
    expect(
      resolveSiderOpenKeys({
        collapsed: false,
        previousCollapsed: true,
        currentOpenKeys: [],
        cachedOpenKeys: ['/admin/workspace'],
        routeOpenKeys: ['/admin/system'],
      }),
    ).toEqual({
      openKeys: ['/admin/workspace'],
      cachedOpenKeys: ['/admin/workspace'],
    })
  })
})
