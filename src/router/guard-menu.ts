import type { RouteMeta, RouteRecordRaw } from 'vue-router'
import type { MenuInfo } from '@/api/menu'

type AccessMode = NonNullable<RouteMeta['access']>['mode']

const DEFAULT_ACCESS_MODE: AccessMode = 'menu'

export function filterRoutesByMenuAccess(
  routes: readonly RouteRecordRaw[],
  menus: readonly MenuInfo[],
): RouteRecordRaw[] {
  return filterRoutesByAccess(routes, menus, true)
}

export function filterRoutesByAccess(
  routes: readonly RouteRecordRaw[],
  menus: readonly MenuInfo[],
  isAuthenticated: boolean,
): RouteRecordRaw[] {
  const menuPathSet = createFlatMenuPathSet(menus)
  const routePathMap = createRoutePathMap(routes)

  return filterRouteTree(routes, '', menuPathSet, routePathMap, isAuthenticated)
}

function createFlatMenuPathSet(menus: readonly MenuInfo[]) {
  // Backend menus are already flattened, so permission lookup only needs a path set.
  return new Set(
    menus.map(menu => normalizePath(menu.path)).filter((path): path is string => Boolean(path)),
  )
}

function filterRouteTree(
  routes: readonly RouteRecordRaw[],
  parentPath: string,
  menuPathSet: ReadonlySet<string>,
  routePathMap: ReadonlyMap<string, RouteRecordRaw>,
  isAuthenticated: boolean,
): RouteRecordRaw[] {
  return routes.flatMap(route => {
    const currentPath = resolveRoutePath(parentPath, route.path)
    const children = route.children
      ? filterRouteTree(route.children, currentPath, menuPathSet, routePathMap, isAuthenticated)
      : undefined
    const isAccessible = checkRouteAccess(
      route,
      currentPath,
      menuPathSet,
      routePathMap,
      isAuthenticated,
    )

    if (!isAccessible && !children?.length) {
      return []
    }

    const nextRoute: RouteRecordRaw = { ...route }

    if (children?.length) {
      nextRoute.children = children
    } else {
      delete nextRoute.children
    }

    return [nextRoute]
  })
}

function checkRouteAccess(
  route: RouteRecordRaw,
  routePath: string,
  menuPathSet: ReadonlySet<string>,
  routePathMap: ReadonlyMap<string, RouteRecordRaw>,
  isAuthenticated: boolean,
): boolean {
  const resolvedAccess = resolveRouteAccess(route, routePath, routePathMap)

  if (resolvedAccess.mode === 'public') {
    return true
  }

  if (!isAuthenticated) {
    return false
  }

  if (resolvedAccess.mode === 'login') {
    return true
  }

  return menuPathSet.has(resolvedAccess.permissionPath)
}

function resolveRouteAccess(
  route: RouteRecordRaw,
  routePath: string,
  routePathMap: ReadonlyMap<string, RouteRecordRaw>,
  visited = new Set<string>(),
): { mode: AccessMode; permissionPath: string } {
  const access = route.meta?.access
  const mode = access?.mode ?? DEFAULT_ACCESS_MODE

  if (mode !== 'inherit') {
    return {
      mode,
      permissionPath: routePath,
    }
  }

  const fromPath = normalizePath(access?.from)
  if (!fromPath || visited.has(fromPath)) {
    return {
      mode: DEFAULT_ACCESS_MODE,
      permissionPath: routePath,
    }
  }

  const fromRoute = routePathMap.get(fromPath)
  if (!fromRoute) {
    return {
      mode: DEFAULT_ACCESS_MODE,
      permissionPath: routePath,
    }
  }

  visited.add(fromPath)
  return resolveRouteAccess(fromRoute, fromPath, routePathMap, visited)
}

function createRoutePathMap(
  routes: readonly RouteRecordRaw[],
  parentPath = '',
  routePathMap = new Map<string, RouteRecordRaw>(),
): Map<string, RouteRecordRaw> {
  for (const route of routes) {
    const currentPath = resolveRoutePath(parentPath, route.path)
    // Keep the first route for a path so parent records remain the inherit source
    // when an index child shares the same normalized path.
    if (!routePathMap.has(currentPath)) {
      routePathMap.set(currentPath, route)
    }

    if (route.children?.length) {
      createRoutePathMap(route.children, currentPath, routePathMap)
    }
  }

  return routePathMap
}

function resolveRoutePath(parentPath: string, routePath?: string) {
  if (!routePath) {
    return normalizePath(parentPath) ?? '/'
  }

  if (routePath.startsWith('/')) {
    return normalizePath(routePath) ?? '/'
  }

  const normalizedParentPath = normalizePath(parentPath)
  if (!normalizedParentPath || normalizedParentPath === '/') {
    return normalizePath(`/${routePath}`) ?? '/'
  }

  return normalizePath(`${normalizedParentPath}/${routePath}`) ?? '/'
}

function normalizePath(path?: string | null) {
  if (path == null || path === '') {
    return undefined
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  if (normalizedPath === '/') {
    return normalizedPath
  }

  return normalizedPath.replace(/\/+$/, '')
}
