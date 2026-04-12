import type { SysMenu } from '#db/sys_menu'
import { MENU_TYPE } from '@/constants/menu'
import { defineMock, response } from '../../index'
import { cloneSysMenuSeeds } from './seeds/menu'

type MenuListPayload = {
  page?: number
  pageSize?: number
  menuType?: string
  title?: string
  path?: string
}

const menuStore = cloneSysMenuSeeds()
const MOCK_OPERATOR_ID = 'mock-system-admin'
const MOCK_OPERATOR_NAME = 'Mock System Admin'

export default defineMock({
  '[POST]/admin/system/menu'({ data }) {
    const payload = normalizePayload(data)
    const filteredMenus = queryMenus(payload)
    const total = filteredMenus.length
    const page = normalizePage(payload.page)
    const pageSize = normalizePageSize(payload.pageSize)
    const start = (page - 1) * pageSize
    const list = filteredMenus.slice(start, start + pageSize)

    return response({
      code: 200,
      msg: 'success',
      data: {
        list,
        total,
      },
    })
  },
  '[POST]/admin/system/menu/save'({ data }) {
    return response({
      code: 200,
      msg: 'success',
      data: saveMenu(data),
    })
  },
  '[POST]/admin/system/menu/delete'({ data }) {
    return response({
      code: 200,
      msg: 'success',
      data: deleteMenu(data),
    })
  },
  '[GET]/admin/system/menu/{id}'({ params }) {
    const menu = findMenuById(params.id)

    return response({
      code: 200,
      msg: 'success',
      data: menu ? cloneMenu(menu) : null,
    })
  },
  '/admin/system/menu/parent-options'() {
    return response({
      code: 200,
      msg: 'success',
      data: queryParentMenus(),
    })
  },
})

function queryMenus(query: MenuListPayload) {
  return getActiveMenus()
    .filter(menu => {
      if (query.menuType && menu.menuType !== query.menuType) {
        return false
      }

      if (query.path && !includesIgnoreCase(menu.path, query.path)) {
        return false
      }

      if (query.title && !includesIgnoreCase(menu.title, query.title)) {
        return false
      }

      return true
    })
    .sort(compareMenu)
    .map(cloneMenu)
}

function queryParentMenus() {
  return getActiveMenus()
    .filter(menu => menu.menuType === MENU_TYPE.DIR || menu.menuType === MENU_TYPE.MENU)
    .sort(compareMenu)
    .map(cloneMenu)
}

function getActiveMenus() {
  return menuStore.filter(menu => !menu.isDelete)
}

function findMenuById(id: unknown) {
  return getActiveMenus().find(menu => menu.id === String(id))
}

function saveMenu(data: unknown) {
  const payload = normalizeMenuPayload(data)
  const now = new Date()
  const existingMenu = payload.id ? findMenuById(payload.id) : undefined

  if (existingMenu) {
    Object.assign(existingMenu, {
      ...payload,
      id: existingMenu.id,
      updateId: MOCK_OPERATOR_ID,
      updateName: MOCK_OPERATOR_NAME,
      updateTime: now,
    })

    return cloneMenu(existingMenu)
  }

  const createdMenu: SysMenu = {
    id: payload.id || `mock-menu-${Date.now()}`,
    createId: MOCK_OPERATOR_ID,
    createName: MOCK_OPERATOR_NAME,
    createTime: now,
    updateId: MOCK_OPERATOR_ID,
    updateName: MOCK_OPERATOR_NAME,
    updateTime: now,
    code: payload.code ?? null,
    isDelete: false,
    parentId: payload.parentId ?? null,
    parentPath: payload.parentPath ?? null,
    sort: payload.sort ?? 0,
    title: payload.title ?? null,
    permission: payload.permission ?? null,
    menuType: payload.menuType ?? null,
    path: payload.path ?? null,
    icon: payload.icon ?? null,
    component: payload.component ?? null,
    locale: payload.locale ?? null,
    menuStatus: payload.menuStatus ?? 0,
    affix: payload.affix ?? 0,
    redirect: payload.redirect ?? null,
    name: payload.name ?? null,
    hideInMenu: payload.hideInMenu ?? 0,
    parentKeys: payload.parentKeys ?? null,
    url: payload.url ?? null,
    hideInBreadcrumb: payload.hideInBreadcrumb ?? 0,
    hideChildrenInMenu: payload.hideChildrenInMenu ?? 0,
    keepAlive: payload.keepAlive ?? 0,
    target: payload.target ?? null,
  }

  menuStore.push(createdMenu)
  return cloneMenu(createdMenu)
}

function deleteMenu(data: unknown) {
  const id = normalizeDeleteId(data)
  const targetIndex = menuStore.findIndex(menu => menu.id === id)

  if (targetIndex >= 0) {
    menuStore.splice(targetIndex, 1)
  }

  return {
    id,
  }
}

function normalizePayload(data: unknown) {
  if (typeof data !== 'object' || data === null) {
    return {}
  }

  const payload = data as Record<string, unknown>

  return {
    page: toNumber(payload.page),
    pageSize: toNumber(payload.pageSize),
    title: toStringValue(payload.title),
    path: toStringValue(payload.path),
    menuType: toStringValue(payload.menuType),
  } satisfies MenuListPayload
}

function normalizeMenuPayload(data: unknown): Partial<SysMenu> {
  if (typeof data !== 'object' || data === null) {
    return {}
  }

  return { ...(data as Record<string, unknown>) } as Partial<SysMenu>
}

function normalizeDeleteId(data: unknown) {
  if (typeof data === 'string' || typeof data === 'number') {
    return String(data)
  }

  if (typeof data === 'object' && data !== null && 'id' in data) {
    return String((data as { id?: unknown }).id ?? '')
  }

  return ''
}

function toNumber(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : undefined
  }

  return undefined
}

function toStringValue(value: unknown) {
  return typeof value === 'string' && value !== '' ? value : undefined
}

function normalizePage(page: number | undefined) {
  return page && page > 0 ? Math.floor(page) : 1
}

function normalizePageSize(pageSize: number | undefined) {
  return pageSize && pageSize > 0 ? Math.floor(pageSize) : 10
}

function includesIgnoreCase(value: string | null | undefined, keyword: string) {
  return value?.toLowerCase().includes(keyword.toLowerCase()) ?? false
}

function compareMenu(left: SysMenu, right: SysMenu) {
  if ((left.sort ?? 0) !== (right.sort ?? 0)) {
    return (left.sort ?? 0) - (right.sort ?? 0)
  }

  return String(left.id).localeCompare(String(right.id))
}

function cloneMenu(menu: SysMenu): SysMenu {
  return {
    ...menu,
    createTime: menu.createTime ? new Date(menu.createTime) : null,
    updateTime: menu.updateTime ? new Date(menu.updateTime) : null,
  }
}
