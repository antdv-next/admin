import { describe, expect, it } from 'vite-plus/test'
import { MENU_TYPE } from '@/constants/menu'
import menuMock from '../menu'

describe('mock admin system menu', () => {
  it('saves menu form data and returns the persisted record', async () => {
    const handler = menuMock.data['[POST]/admin/system/menu/save']
    expect(typeof handler).toBe('function')

    const result = await (
      handler as (...args: any[]) => Promise<{ body: { data: any } }> | { body: { data: any } }
    )({
      data: {
        id: '',
        menuType: MENU_TYPE.MENU,
        parentId: '4',
        title: '新建菜单',
      },
      headers: {},
      params: {},
      query: {},
    })

    expect(result).toMatchObject({
      body: {
        code: 200,
        msg: 'success',
      },
    })
    expect(result?.body.data).toMatchObject({
      menuType: MENU_TYPE.MENU,
      parentId: '4',
      title: '新建菜单',
    })
    expect(result?.body.data.id).toBeTruthy()
  })

  it('deletes menu by id', async () => {
    const saveHandler = menuMock.data['[POST]/admin/system/menu/save']
    const deleteHandler = menuMock.data['[POST]/admin/system/menu/delete']

    expect(typeof saveHandler).toBe('function')
    expect(typeof deleteHandler).toBe('function')

    const created = await (
      saveHandler as (...args: any[]) => Promise<{ body: { data: any } }> | { body: { data: any } }
    )({
      data: {
        id: '',
        menuType: MENU_TYPE.BUTTON,
        parentId: '9',
        title: '待删除按钮',
      },
      headers: {},
      params: {},
      query: {},
    })

    const id = created?.body.data?.id
    expect(id).toBeTruthy()

    const deleted = await (
      deleteHandler as (
        ...args: any[]
      ) => Promise<{ body: { data: any } }> | { body: { data: any } }
    )({
      data: {
        id,
      },
      headers: {},
      params: {},
      query: {},
    })

    expect(deleted).toMatchObject({
      body: {
        code: 200,
        msg: 'success',
        data: {
          id,
        },
      },
    })
  })

  it('returns menu detail by id for edit modal', async () => {
    const handler = menuMock.data['[GET]/admin/system/menu/{id}']
    expect(typeof handler).toBe('function')

    const result = await (
      handler as (...args: any[]) => Promise<{ body: { data: any } }> | { body: { data: any } }
    )({
      data: {},
      headers: {},
      params: {
        id: '9',
      },
      query: {},
    })

    expect(result).toMatchObject({
      body: {
        code: 200,
        msg: 'success',
      },
    })

    expect(result?.body.data).toMatchObject({
      id: '9',
      menuType: MENU_TYPE.MENU,
      title: '菜单管理',
    })
  })

  it('returns directory and menu nodes for parent options, excluding buttons', async () => {
    const handler = menuMock.data['/admin/system/menu/parent-options']
    expect(typeof handler).toBe('function')

    const result = await (
      handler as (...args: any[]) => Promise<{ body: { data: any[] } }> | { body: { data: any[] } }
    )({
      data: {},
      headers: {},
      params: {},
      query: {},
    })

    expect(result).toMatchObject({
      body: {
        code: 200,
        msg: 'success',
      },
    })

    const menus = result?.body.data ?? []

    expect(menus.length).toBeGreaterThan(0)
    expect(menus.some(menu => menu.menuType === MENU_TYPE.DIR)).toBe(true)
    expect(menus.some(menu => menu.menuType === MENU_TYPE.MENU)).toBe(true)
    expect(menus.every(menu => menu.menuType !== MENU_TYPE.BUTTON)).toBe(true)
  })
})
