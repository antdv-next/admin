import { normalizeFsPath } from './utils'

export type LayoutSourceKind = 'global' | 'module-static' | 'module-wildcard'

export interface ResolvedLayoutSource {
  kind: LayoutSourceKind
  layoutDir: string
  rootDir: string
  routePrefix?: string
  wildcardRegex?: string
}

function trimSlashes(value: string) {
  return value.replace(/^\/+/, '').replace(/\/+$/, '')
}

function normalizeLayoutDir(layoutDir: string) {
  return trimSlashes(normalizeFsPath(layoutDir).replace(/^\.?\//, ''))
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function toAbsoluteLikePath(value: string) {
  const normalized = trimSlashes(value)
  return normalized ? `/${normalized}` : '/'
}

export function resolveLayoutSources(layoutDirs: string[]): ResolvedLayoutSource[] {
  const sources: ResolvedLayoutSource[] = []
  const seen = new Set<string>()

  for (const layoutDir of layoutDirs) {
    const normalizedDir = normalizeLayoutDir(layoutDir)
    if (!normalizedDir || seen.has(normalizedDir)) continue
    seen.add(normalizedDir)

    const wildcardMatch = normalizedDir.match(/^(.*)\/\*\/layouts$/)
    if (wildcardMatch) {
      const rootDir = trimSlashes(wildcardMatch[1] ?? '')
      if (!rootDir) continue

      sources.push({
        kind: 'module-wildcard',
        layoutDir: toAbsoluteLikePath(normalizedDir),
        rootDir,
        wildcardRegex: `^/${escapeRegex(rootDir)}/([^/]+)/layouts/(.+)\\.vue$`,
      })
      continue
    }

    const staticMatch = normalizedDir.match(/^(.*)\/layouts$/)
    if (staticMatch) {
      const rootDir = trimSlashes(staticMatch[1] ?? '')
      if (!rootDir || rootDir === 'src') {
        sources.push({
          kind: 'global',
          layoutDir: toAbsoluteLikePath(normalizedDir),
          rootDir: rootDir || 'src',
        })
      } else {
        const segments = rootDir.split('/').filter(Boolean)
        const routePrefix = segments.at(-1)
        if (!routePrefix) continue

        sources.push({
          kind: 'module-static',
          layoutDir: toAbsoluteLikePath(normalizedDir),
          rootDir,
          routePrefix,
        })
      }
      continue
    }

    sources.push({
      kind: 'global',
      layoutDir: toAbsoluteLikePath(normalizedDir),
      rootDir: 'src',
    })
  }

  return sources
}
