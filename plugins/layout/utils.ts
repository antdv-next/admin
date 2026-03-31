export function normalizeGlobPath(path: string) {
  const normalizedPath = path
    .replace(/\\/g, '/')
    .replace(/^\.?\//, '')
    .replace(/\/+$/, '')
  return normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`
}

export function normalizeFsPath(filePath: string) {
  return filePath.replace(/\\/g, '/')
}

export function normalizeGlobPattern(pattern: string) {
  const normalizedPattern = normalizeFsPath(pattern)
  const isNegated = normalizedPattern.startsWith('!')
  const withoutNegation = isNegated ? normalizedPattern.slice(1) : normalizedPattern
  const withoutRelative = withoutNegation.replace(/^\.?\//, '')
  const absolutePattern = withoutRelative.startsWith('/') ? withoutRelative : `/${withoutRelative}`
  return isNegated ? `!${absolutePattern}` : absolutePattern
}

export function normalizeExcludeGlob(pattern: string) {
  const normalizedPattern = normalizeGlobPattern(pattern)
  return normalizedPattern.startsWith('!') ? normalizedPattern.slice(1) : normalizedPattern
}

export function toViteExcludeGlob(pattern: string) {
  const normalizedPattern = normalizeGlobPattern(pattern)
  return normalizedPattern.startsWith('!') ? normalizedPattern : `!${normalizedPattern}`
}

export function toLayoutWatchGlob(path: string) {
  return `${path.replace(/\/+$/, '')}/**/*.vue`
}

export function isLayoutVueFile(filePath: string) {
  const normalizedPath = normalizeFsPath(filePath)
  return normalizedPath.endsWith('.vue') && normalizedPath.includes('/layouts/')
}
