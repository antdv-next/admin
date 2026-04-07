import { relative } from 'node:path'

export function normalizeFsPath(filePath: string) {
  return filePath.replace(/\\/g, '/')
}

function normalizeDynamicSegment(segment: string) {
  const catchAllMatch = /^\[\.\.\.(.+)\]$/.exec(segment)
  if (catchAllMatch?.[1]) return `$${catchAllMatch[1]}`

  const optionalMatch = /^\[\[(.+)\]\]$/.exec(segment)
  if (optionalMatch?.[1]) return `$${optionalMatch[1]}`

  const dynamicMatch = /^\[(.+)\]$/.exec(segment)
  if (dynamicMatch?.[1]) return `$${dynamicMatch[1]}`

  return segment
}

export function normalizeNamespaceSegments(segments: string[]) {
  const normalized = segments.filter(Boolean).map(normalizeDynamicSegment)

  while (normalized[normalized.length - 1] === 'index') {
    normalized.pop()
  }

  return normalized
}

export function toRelativeRootPath(root: string, filePath: string) {
  return normalizeFsPath(relative(root, filePath))
}
