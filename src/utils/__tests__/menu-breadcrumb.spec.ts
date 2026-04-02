import { describe, expect, it } from 'vite-plus/test'
import { MENU_TYPE } from '@/constants/menu'
import { resolveMenuBreadcrumbItems } from '@/utils/menu-breadcrumb'

describe('menu breadcrumb utils', () => {
  it('resolves a breadcrumb chain from the menu tree', () => {
    const items = resolveMenuBreadcrumbItems(
      [
        {
          id: 'root',
          title: '系统管理',
          icon: 'SettingOutlined',
          path: null,
          menuType: MENU_TYPE.DIR,
        },
        {
          id: 'menu',
          parentId: 'root',
          title: '菜单管理',
          path: '/admin/system/menu',
          menuType: MENU_TYPE.MENU,
        },
      ] as any,
      '/admin/system/menu',
    )

    expect(items).toEqual([
      {
        key: 'root',
        icon: 'SettingOutlined',
        title: '系统管理',
      },
      {
        key: '/admin/system/menu',
        path: '/admin/system/menu',
        title: '菜单管理',
      },
    ])
  })

  it('skips breadcrumb nodes marked as hidden', () => {
    const items = resolveMenuBreadcrumbItems(
      [
        {
          id: 'workspace',
          title: '工作台',
          path: '/admin/workspace',
          menuType: MENU_TYPE.DIR,
        },
        {
          id: 'overview',
          parentId: 'workspace',
          title: '概览',
          path: '/admin/workspace/overview',
          menuType: MENU_TYPE.MENU,
          hideInBreadcrumb: 1,
        },
        {
          id: 'dashboard',
          parentId: 'overview',
          title: '控制台',
          path: '/admin/workspace/dashboard',
          menuType: MENU_TYPE.MENU,
        },
      ] as any,
      '/admin/workspace/dashboard',
    )

    expect(items).toEqual([
      {
        key: '/admin/workspace',
        path: '/admin/workspace',
        title: '工作台',
      },
      {
        key: '/admin/workspace/dashboard',
        path: '/admin/workspace/dashboard',
        title: '控制台',
      },
    ])
  })
})
