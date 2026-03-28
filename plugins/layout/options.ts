import { DEFAULT_LAYOUT_DIRS } from './constants'
import { resolveLayoutSources } from './sources'
import type { LayoutPluginOptions, ModuleLayoutOptions, ResolvedLayoutPluginOptions } from './types'
import { normalizeFsPath } from './utils'

function toArray(value: string | string[] | undefined, fallback: readonly string[]) {
  if (!value) return [...fallback]

  return Array.isArray(value) ? value : [value]
}

function normalizeRoutePrefix(routePrefix: string) {
  return normalizeFsPath(routePrefix).replace(/^\/+/, '').replace(/\/+$/, '')
}

function normalizeModuleName(moduleName: string) {
  return normalizeFsPath(moduleName).replace(/^\/+/, '').replace(/\/+$/, '')
}

function normalizeModules(
  modules: LayoutPluginOptions['modules'],
): Record<string, ModuleLayoutOptions> {
  if (!modules) return {}

  const normalized: Record<string, ModuleLayoutOptions> = {}

  for (const [routePrefix, moduleOptions] of Object.entries(modules)) {
    const normalizedPrefix = normalizeRoutePrefix(routePrefix)
    if (!normalizedPrefix) continue

    if (!moduleOptions || typeof moduleOptions !== 'object') {
      normalized[normalizedPrefix] = {}
      continue
    }

    const moduleName =
      typeof moduleOptions.module === 'string'
        ? normalizeModuleName(moduleOptions.module)
        : undefined

    normalized[normalizedPrefix] = {
      module: moduleName || undefined,
      layout:
        typeof moduleOptions.layout === 'string' && moduleOptions.layout.length > 0
          ? moduleOptions.layout
          : undefined,
      fallbackLayout: moduleOptions.fallbackLayout,
    }
  }

  return normalized
}

export function resolveLayoutOptions(
  userOptions: LayoutPluginOptions = {},
): ResolvedLayoutPluginOptions {
  const layoutDirs = toArray(userOptions.layoutDirs, DEFAULT_LAYOUT_DIRS)
  const defaultLayout = userOptions.defaultLayout ?? 'default'
  const globalFallbackLayout =
    userOptions.globalFallbackLayout ??
    (userOptions.fallbackToGlobalDefault === false ? false : defaultLayout)

  return {
    defaultLayout,
    globalFallbackLayout,
    modules: normalizeModules(userOptions.modules),
    layoutDirs,
    layoutSources: resolveLayoutSources(layoutDirs),
    exclude: toArray(userOptions.exclude, []),
    importMode: userOptions.importMode ?? 'async',
  }
}
