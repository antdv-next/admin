import type { SysMenu } from '#db/sys_menu'
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
})

function queryMenus(query: MenuListPayload) {
  return menuStore
    .filter(menu => !menu.isDelete)
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
    .sort((left, right) => {
      if ((left.sort ?? 0) !== (right.sort ?? 0)) {
        return (left.sort ?? 0) - (right.sort ?? 0)
      }

      return String(left.id).localeCompare(String(right.id))
    })
    .map(cloneMenu)
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

function cloneMenu(menu: SysMenu): SysMenu {
  return {
    ...menu,
    createTime: menu.createTime ? new Date(menu.createTime) : null,
    updateTime: menu.updateTime ? new Date(menu.updateTime) : null,
  }
}
