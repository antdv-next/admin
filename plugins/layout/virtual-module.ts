import type { ResolvedLayoutPluginOptions } from './types'
import { normalizeGlobPath, toViteExcludeGlob } from './utils'

export function createVirtualModuleCode(options: ResolvedLayoutPluginOptions) {
  const includeGlobs = options.layoutDirs
    .map(dir => normalizeGlobPath(dir))
    .map(dir => `'${dir}/**/*.vue'`)

  const excludeGlobs = options.exclude
    .map(pattern => toViteExcludeGlob(pattern))
    .map(pattern => `'${pattern}'`)

  const globs = [...includeGlobs, ...excludeGlobs]
    .join(', ')

  return `
const modules = import.meta.glob([${globs}], { eager: ${options.importMode === 'sync'} })
const layouts = Object.create(null)

function resolveModule(module) {
  if (module && typeof module === 'object' && 'default' in module)
    return module.default

  return module
}

function getLayoutKey(filePath) {
  const appLayout = filePath.match(/\\/apps\\/([^/]+)\\/layouts\\/(.+)\\.vue$/)
  if (appLayout)
    return \`\${appLayout[1]}/\${appLayout[2]}\`.replace(/\\/index$/, '')

  const srcLayout = filePath.match(/\\/src\\/layouts\\/(.+)\\.vue$/)
  if (srcLayout)
    return srcLayout[1].replace(/\\/index$/, '')

  const genericLayout = filePath.match(/\\/layouts\\/(.+)\\.vue$/)
  return genericLayout ? genericLayout[1].replace(/\\/index$/, '') : null
}

Object.entries(modules).forEach(([filePath, module]) => {
  const key = getLayoutKey(filePath)
  if (key)
    layouts[key] = resolveModule(module)
})
function getAppName(routePath) {
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

  const appName = getAppName(route.path)
  if (appName) {
    const appDefaultLayout = \`\${appName}/${options.defaultLayout}\`
    if (layouts[appDefaultLayout])
      return appDefaultLayout
  }

  return '${options.defaultLayout}'
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

function deepSetupLayout(routes, top = true) {
  return routes.map((route) => {
    const nextRoute = route.children?.length
      ? { ...route, children: deepSetupLayout(route.children, false) }
      : route

    if (nextRoute.meta?.isLayout)
      return nextRoute

    if (top) {
      const skipLayout = !nextRoute.component
        && nextRoute.children?.some(child => (child.path === '' || child.path === '/') && child.meta?.isLayout)

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

export function setupLayouts(routes) {
  return deepSetupLayout(routes)
}

export function createGetRoutes(router, withLayout = false) {
  const routes = router.getRoutes()
  if (withLayout)
    return routes

  return () => routes.filter(route => !route.meta?.isLayout)
}
`
}
