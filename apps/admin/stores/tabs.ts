import type { RouteLocationNormalizedLoaded } from 'vue-router'
import type { MenuInfo } from '@/api/menu'
import { AUTH_DEFAULT_PATH } from '@/constants/router'
import { isRouteMissing } from '@/router/route-registry'

export interface AdminTabItem {
  affix: boolean
  fullPath: string
  keepAliveName?: string
  path: string
  title: string
}

interface AdminTabsState {
  refreshVersions: Record<string, number>
  tabs: AdminTabItem[]
}

type AdminTabRoute = Pick<RouteLocationNormalizedLoaded, 'fullPath' | 'matched' | 'meta' | 'path'> &
  Partial<Pick<RouteLocationNormalizedLoaded, 'query'>>

/**
 * 关闭标签后需要激活的地址：被关闭的是当前激活标签时，优先右侧邻居，其次左侧邻居。
 * 关闭的不是激活标签时无需跳转。
 */
export function resolveNextActivePath(
  tabs: readonly AdminTabItem[],
  closingPath: string,
  activePath: string,
) {
  if (closingPath !== activePath) {
    return undefined
  }

  const closingIndex = tabs.findIndex(tab => tab.path === closingPath)
  if (closingIndex < 0) {
    return undefined
  }

  const nextTab = tabs[closingIndex + 1] ?? tabs[closingIndex - 1]
  return nextTab?.fullPath ?? AUTH_DEFAULT_PATH
}

/** 页面组件名，用于 keep-alive 的 include 匹配；页面组件需要 defineOptions({ name }) */
export function resolveRouteComponentName(route: AdminTabRoute) {
  const record = route.matched[route.matched.length - 1]
  const component = record?.components?.default
  if (!component || typeof component === 'function') {
    return undefined
  }

  const namedComponent = component as { __name?: string; name?: string }
  return namedComponent.name ?? namedComponent.__name
}

function findMenuByPath(menus: readonly MenuInfo[], path: string) {
  return menus.find(menu => menu.path === path)
}

export const useAdminTabsStore = defineStore('adminTabs', {
  state: (): AdminTabsState => ({
    refreshVersions: {},
    tabs: [],
  }),
  getters: {
    keepAliveNames(state) {
      return [
        ...new Set(
          state.tabs.map(tab => tab.keepAliveName).filter((name): name is string => Boolean(name)),
        ),
      ]
    },
  },
  actions: {
    /** 从菜单中同步固定标签（affix），并把当前路由记录为标签 */
    syncActiveTab(route: AdminTabRoute, menus: readonly MenuInfo[]) {
      for (const menu of menus) {
        if (menu.affix !== 1 || !menu.path) {
          continue
        }
        if (this.tabs.some(tab => tab.path === menu.path)) {
          continue
        }
        this.tabs.push({
          affix: true,
          fullPath: menu.path,
          path: menu.path,
          title: menu.title ?? menu.path,
        })
      }

      // 404 等 catch-all 兜底页不生成标签
      if (isRouteMissing(route)) {
        return
      }

      const menu = findMenuByPath(menus, route.path)
      // iframe 承载页等场景会通过 query.title 传入展示标题
      const queryTitle = typeof route.query?.title === 'string' ? route.query.title : undefined
      const metaTitle = typeof route.meta.title === 'string' ? route.meta.title : undefined
      const title = menu?.title ?? queryTitle ?? metaTitle ?? route.path
      const keepAliveName = menu?.keepAlive === 1 ? resolveRouteComponentName(route) : undefined

      const existing = this.tabs.find(tab => tab.path === route.path)
      if (existing) {
        existing.fullPath = route.fullPath
        existing.title = title
        if (keepAliveName) {
          existing.keepAliveName = keepAliveName
        }
        return
      }

      this.tabs.push({
        affix: menu?.affix === 1,
        fullPath: route.fullPath,
        keepAliveName,
        path: route.path,
        title,
      })
    },
    /** 关闭一个标签；返回值为需要跳转到的地址（关闭的是当前激活标签时） */
    closeTab(path: string, activePath: string) {
      const closingTab = this.tabs.find(tab => tab.path === path)
      if (!closingTab || closingTab.affix) {
        return undefined
      }

      const nextActivePath = resolveNextActivePath(this.tabs, path, activePath)
      this.tabs = this.tabs.filter(tab => tab.path !== path)
      return nextActivePath
    },
    /** 关闭除指定标签外的所有可关闭标签 */
    closeOtherTabs(path: string) {
      this.tabs = this.tabs.filter(tab => tab.affix || tab.path === path)
    },
    /** 关闭所有可关闭标签；当前激活标签被关闭时返回需要跳转到的地址 */
    closeAllTabs(activePath: string) {
      this.tabs = this.tabs.filter(tab => tab.affix)
      if (this.tabs.some(tab => tab.path === activePath)) {
        return undefined
      }
      return this.tabs[0]?.fullPath ?? AUTH_DEFAULT_PATH
    },
    /** 强制重建指定路径的页面实例，不影响其他标签的缓存 */
    refreshTab(path: string) {
      this.refreshVersions[path] = (this.refreshVersions[path] ?? 0) + 1
    },
    /** 页面渲染 key 的版本号，配合 refreshTab 触发重建 */
    getRefreshVersion(path: string) {
      return this.refreshVersions[path] ?? 0
    },
  },
})
