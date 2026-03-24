import type { ResolvedLayoutPluginOptions } from './types';

import { normalizeGlobPath, toViteExcludeGlob } from './utils';

export function createVirtualModuleCode(options: ResolvedLayoutPluginOptions) {
  const includeGlobs = options.layoutDirs
    .map((dir) => normalizeGlobPath(dir))
    .map((dir) => `'${dir}/**/*.vue'`);

  const excludeGlobs = options.exclude
    .map((pattern) => toViteExcludeGlob(pattern))
    .map((pattern) => `'${pattern}'`);

  const globs = [...includeGlobs, ...excludeGlobs].join(', ');

  const defaultLayoutLiteral = JSON.stringify(options.defaultLayout);
  const globalFallbackLayoutLiteral = JSON.stringify(options.globalFallbackLayout);
  const modulesLiteral = JSON.stringify(options.modules);
  const layoutSourcesLiteral = JSON.stringify(options.layoutSources);

  return `
const modules = import.meta.glob([${globs}], { eager: ${options.importMode === 'sync'} })
const layouts = Object.create(null)
const defaultLayoutKey = ${defaultLayoutLiteral}
const routeModules = ${modulesLiteral}
const layoutSources = ${layoutSourcesLiteral}
const knownModuleRoutePrefixes = new Set(Object.keys(routeModules))
const moduleNameOverrides = Object.create(null)

Object.entries(routeModules).forEach(([routePrefix, config]) => {
  if (typeof config?.module === 'string' && config.module.length > 0)
    moduleNameOverrides[routePrefix] = config.module
})

layoutSources.forEach((source) => {
  if (source.kind === 'module-static' && source.routePrefix)
    knownModuleRoutePrefixes.add(source.routePrefix)
})

function resolveModule(module) {
  if (module && typeof module === 'object' && 'default' in module)
    return module.default

  return module
}

function normalizeLayoutPath(value) {
  return value.replace(/\\.vue$/, '').replace(/\\/index$/, '')
}

function resolveLayoutInfo(filePath) {
  const normalizedFilePath = filePath.startsWith('/') ? filePath : \`/\${filePath.replace(/^\\/+/, '')}\`

  for (const source of layoutSources) {
    const normalizedLayoutDir = source.layoutDir.replace(/\\/+$/, '')
    if (source.kind === 'global') {
      const prefix = \`\${normalizedLayoutDir}/\`
      if (!normalizedFilePath.startsWith(prefix))
        continue

      const relativePath = normalizedFilePath.slice(prefix.length)
      return {
        layoutKey: normalizeLayoutPath(relativePath),
      }
    }

    if (source.kind === 'module-static') {
      const prefix = \`\${normalizedLayoutDir}/\`
      if (!normalizedFilePath.startsWith(prefix))
        continue

      const relativePath = normalizedFilePath.slice(prefix.length)
      const routePrefix = source.routePrefix
      const moduleName = moduleNameOverrides[routePrefix] ?? routePrefix

      return {
        layoutKey: \`\${moduleName}/\${normalizeLayoutPath(relativePath)}\`,
        routePrefix,
      }
    }

    if (source.kind === 'module-wildcard' && source.wildcardRegex) {
      const matcher = new RegExp(source.wildcardRegex)
      const matched = normalizedFilePath.match(matcher)
      if (!matched)
        continue

      const routePrefix = matched[1]
      const relativePath = matched[2]
      const moduleName = moduleNameOverrides[routePrefix] ?? routePrefix

      return {
        layoutKey: \`\${moduleName}/\${normalizeLayoutPath(relativePath)}\`,
        routePrefix,
      }
    }
  }

  return null
}

function resolveFallbackLayout(layoutKey) {
  if (layoutKey === false)
    return false

  if (typeof layoutKey === 'string' && layoutKey.length > 0)
    return layouts[layoutKey] ? layoutKey : false

  return false
}

Object.entries(modules).forEach(([filePath, module]) => {
  const info = resolveLayoutInfo(filePath)
  if (!info?.layoutKey)
    return

  if (info.routePrefix)
    knownModuleRoutePrefixes.add(info.routePrefix)

  layouts[info.layoutKey] = resolveModule(module)
})

function getRoutePrefix(routePath) {
  if (!routePath || routePath === '/')
    return ''

  const match = routePath.match(/^\\/?([^/]+)/)
  return match ? match[1] : ''
}

function resolveLayoutKey(route) {
  if (route.meta?.layout === false)
    return false

  if (typeof route.meta?.layout === 'string' && route.meta.layout.length > 0)
    return route.meta.layout

  const routePrefix = getRoutePrefix(route.path)
  if (routePrefix) {
    const routeModule = routeModules[routePrefix]
    const isModuleRoute = Boolean(routeModule) || knownModuleRoutePrefixes.has(routePrefix)

    if (isModuleRoute) {
      if (typeof routeModule?.layout === 'string' && routeModule.layout.length > 0) {
        if (layouts[routeModule.layout])
          return routeModule.layout

        const routeFallbackLayout = routeModule.fallbackLayout ?? ${globalFallbackLayoutLiteral}
        return resolveFallbackLayout(routeFallbackLayout)
      }

      const moduleName = typeof routeModule?.module === 'string' && routeModule.module.length > 0
        ? routeModule.module
        : routePrefix

      const moduleDefaultLayout = \`\${moduleName}/\${defaultLayoutKey}\`
      if (layouts[moduleDefaultLayout])
        return moduleDefaultLayout

      const routeFallbackLayout = routeModule?.fallbackLayout ?? ${globalFallbackLayoutLiteral}
      return resolveFallbackLayout(routeFallbackLayout)
    }
  }

  return defaultLayoutKey
}

function wrapWithLayout(route, layoutKey) {
  const layoutComponent = layouts[layoutKey]
  if (!layoutComponent)
    return route

  return {
    path: route.path,
    component: layoutComponent,
    children: route.path === '/' ? [route] : [{ ...route, path: '' }],
    meta: {
      ...route.meta,
      isLayout: true,
    },
  }
}

function mergePath(parentPath, childPath) {
  if (!childPath) return parentPath
  if (childPath.startsWith('/')) return childPath
  const base = parentPath.replace(/\\/$/, '')
  return base ? \`\${base}/\${childPath}\` : \`/\${childPath}\`
}

function flattenRoutes(routes, parentPath = '') {
  const result = []
  for (const route of routes) {
    const fullPath = mergePath(parentPath, route.path)

    if (!route.children?.length) {
      result.push({ ...route, path: fullPath })
      continue
    }

    if (route.component) {
      result.push({
        ...route,
        path: fullPath,
        children: flattenRoutes(route.children, ''),
      })
    } else {
      if (route.redirect) {
        result.push({ path: fullPath, redirect: route.redirect, meta: route.meta })
      }
      result.push(...flattenRoutes(route.children, fullPath))
    }
  }
  return result
}

function deepSetupLayout(routes, top = true) {
  return routes.map((route) => {
    const nextRoute = route.children?.length
      ? { ...route, children: deepSetupLayout(route.children, false) }
      : route

    if (nextRoute.meta?.isLayout)
      return nextRoute

    if (top) {
      const skipLayout = !nextRoute.component
        && nextRoute.children?.some(child => (child.path === '' || child.path === '/') && (child.meta?.isLayout || child.meta?.layout === false))

      if (!skipLayout) {
        const layoutKey = resolveLayoutKey(nextRoute)
        if (layoutKey !== false)
          return wrapWithLayout(nextRoute, layoutKey)
      }
      return nextRoute
    }

    if (typeof nextRoute.meta?.layout === 'string' && nextRoute.meta.layout.length > 0)
      return wrapWithLayout(nextRoute, nextRoute.meta.layout)

    return nextRoute
  })
}

export function setupLayouts(routes, options = {}) {
  const { flatten = false } = options
  const processedRoutes = flatten ? flattenRoutes(routes) : routes
  return deepSetupLayout(processedRoutes)
}

export function createGetRoutes(router, withLayout = false) {
  const routes = router.getRoutes()
  if (withLayout)
    return routes

  return () => routes.filter(route => !route.meta?.isLayout)
}
`;
}
