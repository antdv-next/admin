import { v7 as uuidV7 } from 'uuid'
import type { SysMenu } from '#db/sys_menu'
import { MENU_TYPE } from '@/constants/menu'
import { defineMock, response } from '../../index'
import { cloneSysMenuSeeds } from './seeds/menu'

type MenuQuery = {
  menuType?: string
  name?: string
  path?: string
}

let menuStore = cloneSysMenuSeeds()

export default defineMock({
  '/admin/system/menu'({ query }) {
    return response({
      code: 200,
      msg: 'success',
      data: queryMenus(normalizeQuery(query)),
    })
  },

  '[POST]/admin/system/menu'({ data }) {
    const payload = normalizePayload(data)
    const nextMenu = createMenuRecord(payload)

    menuStore.push(nextMenu)

    return response({
      code: 200,
      msg: 'success',
      data: cloneMenu(nextMenu),
    })
  },

  '[PUT]/admin/system/menu'({ data }) {
    const payload = normalizePayload(data)
    const menuId = resolveMenuId(payload.id)

    if (!menuId) {
      return response(
        {
          code: 400,
          msg: '菜单ID不能为空',
          data: null,
        },
        {
          status: 400,
          statusText: 'Bad Request',
        },
      )
    }

    const index = menuStore.findIndex(menu => menu.id === menuId && !menu.isDelete)
    if (index === -1) {
      return response(
        {
          code: 404,
          msg: '菜单不存在',
          data: null,
        },
        {
          status: 404,
          statusText: 'Not Found',
        },
      )
    }

    const current = menuStore[index]
    if (!current) {
      return response(
        {
          code: 404,
          msg: '菜单不存在',
          data: null,
        },
        {
          status: 404,
          statusText: 'Not Found',
        },
      )
    }

    const nextMenu = applyMenuPatch(current, payload)

    menuStore[index] = nextMenu

    return response({
      code: 200,
      msg: 'success',
      data: cloneMenu(nextMenu),
    })
  },

  '[DELETE]/admin/system/menu'({ data, query }) {
    const payload = normalizePayload(data)
    const id = resolveMenuId(payload.id ?? resolveQueryValue(query.id))

    if (!id) {
      return response(
        {
          code: 400,
          msg: '菜单ID不能为空',
          data: null,
        },
        {
          status: 400,
          statusText: 'Bad Request',
        },
      )
    }

    const deleteIds = new Set(collectDeleteIds(id))
    if (deleteIds.size === 0) {
      return response(
        {
          code: 404,
          msg: '菜单不存在',
          data: null,
        },
        {
          status: 404,
          statusText: 'Not Found',
        },
      )
    }

    const now = new Date()
    menuStore = menuStore.map(menu => {
      if (!menu.id || !deleteIds.has(menu.id)) {
        return menu
      }

      return {
        ...menu,
        isDelete: true,
        updateTime: now,
      }
    })

    return response({
      code: 200,
      msg: 'success',
      data: {
        ids: [...deleteIds],
      },
    })
  },
})

function queryMenus(query: MenuQuery) {
  return menuStore
    .filter(menu => !menu.isDelete)
    .filter(menu => {
      if (query.menuType && menu.menuType !== query.menuType) {
        return false
      }

      if (query.path && !includesIgnoreCase(menu.path, query.path)) {
        return false
      }

      if (
        query.name &&
        !includesIgnoreCase(menu.title, query.name) &&
        !includesIgnoreCase(menu.name, query.name)
      ) {
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

function normalizeQuery(query: Record<string, string | string[]>) {
  return {
    name: resolveQueryValue(query.name),
    path: resolveQueryValue(query.path),
    menuType: resolveQueryValue(query.menuType),
  } satisfies MenuQuery
}

function resolveQueryValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0]
  }

  return value
}

function resolveMenuId(value: string | null | undefined) {
  if (!value) {
    return null
  }

  return value
}

function normalizePayload(data: unknown) {
  return (typeof data === 'object' && data !== null ? data : {}) as Partial<SysMenu>
}

function createMenuRecord(payload: Partial<SysMenu>): SysMenu {
  const now = new Date()

  return {
    id: payload.id ?? uuidV7(),
    createId: payload.createId ?? 'mock-system-admin',
    createName: payload.createName ?? 'Mock System Admin',
    createTime: payload.createTime ?? now,
    updateId: payload.updateId ?? 'mock-system-admin',
    updateName: payload.updateName ?? 'Mock System Admin',
    updateTime: payload.updateTime ?? now,
    code: payload.code ?? null,
    isDelete: false,
    parentId: payload.parentId ?? null,
    parentPath: payload.parentPath ?? null,
    sort: payload.sort ?? getNextSort(payload.parentId ?? null),
    title: payload.title ?? '未命名菜单',
    permission: payload.permission ?? null,
    menuType: payload.menuType ?? MENU_TYPE.MENU,
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
}

function applyMenuPatch(current: SysMenu, payload: Partial<SysMenu>): SysMenu {
  return {
    id: current.id,
    createId: payload.createId ?? current.createId,
    createName: payload.createName ?? current.createName,
    createTime: payload.createTime ?? current.createTime,
    updateId: payload.updateId ?? current.updateId,
    updateName: payload.updateName ?? current.updateName,
    updateTime: new Date(),
    code: payload.code ?? current.code,
    isDelete: payload.isDelete ?? current.isDelete,
    parentId: payload.parentId ?? current.parentId,
    parentPath: payload.parentPath ?? current.parentPath,
    sort: payload.sort ?? current.sort,
    title: payload.title ?? current.title,
    permission: payload.permission ?? current.permission,
    menuType: payload.menuType ?? current.menuType,
    path: payload.path ?? current.path,
    icon: payload.icon ?? current.icon,
    component: payload.component ?? current.component,
    locale: payload.locale ?? current.locale,
    menuStatus: payload.menuStatus ?? current.menuStatus,
    affix: payload.affix ?? current.affix,
    redirect: payload.redirect ?? current.redirect,
    name: payload.name ?? current.name,
    hideInMenu: payload.hideInMenu ?? current.hideInMenu,
    parentKeys: payload.parentKeys ?? current.parentKeys,
    url: payload.url ?? current.url,
    hideInBreadcrumb: payload.hideInBreadcrumb ?? current.hideInBreadcrumb,
    hideChildrenInMenu: payload.hideChildrenInMenu ?? current.hideChildrenInMenu,
    keepAlive: payload.keepAlive ?? current.keepAlive,
    target: payload.target ?? current.target,
  }
}

function getNextSort(parentId: string | null) {
  const siblingSorts = menuStore
    .filter(menu => !menu.isDelete && (menu.parentId ?? null) === parentId)
    .map(menu => menu.sort ?? 0)

  return siblingSorts.length === 0 ? 1 : Math.max(...siblingSorts) + 1
}

function collectDeleteIds(id: string) {
  const result = new Set<string>()
  const queue = [id]

  while (queue.length > 0) {
    const currentId = queue.shift()
    if (!currentId || result.has(currentId)) {
      continue
    }

    const matchedMenu = menuStore.find(menu => menu.id === currentId && !menu.isDelete)
    if (!matchedMenu) {
      continue
    }

    result.add(currentId)

    const children = menuStore
      .filter(menu => !menu.isDelete && menu.parentId === currentId)
      .map(menu => menu.id)
      .filter((menuId): menuId is string => Boolean(menuId))

    queue.push(...children)
  }

  return [...result]
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
