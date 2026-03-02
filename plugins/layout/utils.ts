export function normalizeGlobPath(path: string) {
  const normalizedPath = path.replaceAll('\\', '/').replace(/^\.?\//, '').replace(/\/+$/, '')
  return normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`
}

export function normalizeFsPath(filePath: string) {
  return filePath.replaceAll('\\', '/')
}

export function toLayoutWatchGlob(path: string) {
  return `${path.replace(/\/+$/, '')}/**/*.vue`
}

export function isLayoutVueFile(filePath: string) {
  const normalizedPath = normalizeFsPath(filePath)
  return normalizedPath.endsWith('.vue') && normalizedPath.includes('/layouts/')
}
