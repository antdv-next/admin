import type { RouteLocationNormalized, RouteRecordRaw } from 'vue-router'
import { createMemoryHistory, createRouter } from 'vue-router'

// 匹配 catch-all 路由记录的 path 形态，例如 /:pathMatch(.*)* 或 /admin/:path(.*)
const CATCH_ALL_RECORD_PATH_PATTERN = /:[\w$]+\(\.\*\)/

const REGISTRY_FALLBACK_NAME = Symbol('route-registry-fallback')

export function isCatchAllRecordPath(path: string) {
  return CATCH_ALL_RECORD_PATH_PATTERN.test(path)
}

/**
 * 当前导航是否没有命中任何真实页面：
 * 未匹配到记录，或最终命中的是 catch-all 兜底路由（全局 404、子应用 404 等）。
 */
export function isRouteMissing(to: Pick<RouteLocationNormalized, 'matched'>) {
  const finalRecord = to.matched[to.matched.length - 1]
  if (!finalRecord) {
    return true
  }
  return isCatchAllRecordPath(finalRecord.path)
}

/**
 * 基于「未做权限过滤的完整路由树」创建路径检查器，用于区分 404 与 403：
 * 路径能在完整路由树中命中真实页面（非 catch-all），说明页面存在、只是被权限过滤。
 */
export function createRoutePathChecker(routes: RouteRecordRaw[]) {
  const registry = createRouter({
    history: createMemoryHistory(),
    routes: [
      ...routes,
      // 内部兜底，保证未命中路径也能正常 resolve 而不触发 vue-router 告警
      {
        path: '/:registryFallback(.*)*',
        name: REGISTRY_FALLBACK_NAME,
        redirect: '/',
      },
    ],
  })

  return (path: string) => {
    const resolved = registry.resolve(path)
    return !isRouteMissing(resolved)
  }
}
