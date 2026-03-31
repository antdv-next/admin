import type { RoutesFolder } from 'vue-router/unplugin'
import type { LayoutPluginOptions } from './layout'
import { resolveLayoutOptions } from './layout/options'

const commonExclude = ['**/components/**', '**/hooks/**', '**/composables/**']

function normalizePath(filePath: string) {
  return filePath.replace(/\\/g, '/')
}

function toRelativePath(filePath: string, prefix: string) {
  const normalizedPath = normalizePath(filePath)
  const normalizedPrefix = `${normalizePath(prefix).replace(/\/+$/, '')}/`
  const index = normalizedPath.lastIndexOf(normalizedPrefix)

  if (index === -1) return normalizedPath

  return normalizedPath.slice(index + normalizedPrefix.length)
}

function createGlobalExclude(rootDir: string) {
  if (rootDir === 'src') {
    return [...commonExclude, 'src/pages/error/**', 'src/pages/index.vue', 'src/pages/auth/**']
  }

  return commonExclude
}

export function loadRouter(layoutOptions: LayoutPluginOptions = {}): RoutesFolder {
  const { layoutSources } = resolveLayoutOptions(layoutOptions)
  const routesFolder: RoutesFolder = []
  const seen = new Set<string>()

  layoutSources.forEach(source => {
    if (source.kind === 'global') {
      const src = `${source.rootDir}/pages`
      const key = `global:${src}`
      if (seen.has(key)) return
      seen.add(key)

      routesFolder.push({
        src,
        path: (filePath: string) => toRelativePath(filePath, src),
        exclude: createGlobalExclude(source.rootDir),
      })
      return
    }

    if (source.kind === 'module-wildcard') {
      const key = `module-wildcard:${source.rootDir}`
      if (seen.has(key)) return
      seen.add(key)

      routesFolder.push({
        src: source.rootDir,
        filePatterns: ['*/pages/**/*'],
        path: (filePath: string) => {
          const routePath = toRelativePath(filePath, source.rootDir)
          return routePath.replace(/^([^/]+)\/pages\//, '$1/')
        },
        exclude: commonExclude,
      })
      return
    }

    if (source.kind === 'module-static' && source.routePrefix) {
      const src = `${source.rootDir}/pages`
      const key = `module-static:${src}:${source.routePrefix}`
      if (seen.has(key)) return
      seen.add(key)

      routesFolder.push({
        src,
        path: (filePath: string) => {
          const routePath = toRelativePath(filePath, src)
          return `${source.routePrefix}/${routePath}`
        },
        exclude: commonExclude,
      })
    }
  })

  return routesFolder
}
