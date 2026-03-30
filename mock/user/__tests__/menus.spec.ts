import { describe, expect, it } from 'vite-plus/test'
import { MENU_TYPE } from '@/constants/menu'
import menusMock from '../menus'

describe('mock user menus', () => {
  it('groups system management menus under a single parent directory', () => {
    const result = menusMock.GET?.()

    expect(result).toMatchObject({
      body: {
        code: 200,
        msg: 'success',
      },
    })

    const menus = result?.body.data ?? []
    const systemMenu = menus.find(menu => menu.title === '系统管理')

    expect(systemMenu).toMatchObject({
      title: '系统管理',
      icon: 'SettingOutlined',
      menuType: MENU_TYPE.DIR,
      path: null,
    })

    const childPaths = menus
      .filter(menu => menu.parentId === systemMenu?.id)
      .map(menu => menu.path)
      .filter((path): path is string => Boolean(path))
      .sort((left, right) => left.localeCompare(right))

    expect(childPaths).toEqual([
      '/admin/system/config',
      '/admin/system/dict',
      '/admin/system/role',
      '/admin/system/user',
    ])
  })
})
