import type { LayoutPluginOptions, ResolvedLayoutPluginOptions } from './types'
import { DEFAULT_LAYOUT_DIRS } from './constants'

function toArray(value: string | string[] | undefined, fallback: readonly string[]) {
  if (!value)
    return [...fallback]

  return Array.isArray(value) ? value : [value]
}

export function resolveLayoutOptions(
  userOptions: LayoutPluginOptions = {},
): ResolvedLayoutPluginOptions {
  return {
    defaultLayout: userOptions.defaultLayout ?? 'default',
    fallbackToGlobalDefault: userOptions.fallbackToGlobalDefault ?? true,
    layoutDirs: toArray(userOptions.layoutDirs, DEFAULT_LAYOUT_DIRS),
    exclude: toArray(userOptions.exclude, []),
    importMode: userOptions.importMode ?? 'async',
  }
}
