import { globSync } from 'node:fs'
import { basename, extname, resolve } from 'node:path'
import { normalizeFsPath, normalizeNamespaceSegments, toRelativeRootPath } from './namespace'
import type { ResolvedI18nPluginOptions } from './options'

export type LocaleSourceKind = 'src-locales' | 'src-pages' | 'app-locales' | 'app-pages'

export interface LocaleSource {
  filePath: string
  importPath: string
  locale: string
  kind: LocaleSourceKind
  appName?: string
  namespaceSegments: string[]
}

const kindOrder: Record<LocaleSourceKind, number> = {
  'src-locales': 0,
  'src-pages': 1,
  'app-locales': 2,
  'app-pages': 3,
}

function stripExtension(filePath: string) {
  return filePath.slice(0, filePath.length - extname(filePath).length)
}

function sortSources(left: LocaleSource, right: LocaleSource) {
  return (
    kindOrder[left.kind] - kindOrder[right.kind] ||
    left.locale.localeCompare(right.locale) ||
    left.namespaceSegments.join('.').localeCompare(right.namespaceSegments.join('.')) ||
    left.filePath.localeCompare(right.filePath)
  )
}

function toLocaleSource(
  root: string,
  filePath: string,
  locale: string,
  kind: LocaleSourceKind,
  namespaceSegments: string[],
  appName?: string,
): LocaleSource {
  const absolutePath = normalizeFsPath(resolve(root, filePath))
  return {
    filePath: absolutePath,
    importPath: absolutePath,
    locale,
    kind,
    appName,
    namespaceSegments,
  }
}

function validatePageLocaleFiles(
  root: string,
  globPattern: string,
  locales: string[],
  label: 'src/pages' | 'apps/*/pages',
) {
  const files = globSync(globPattern, { cwd: root })

  for (const file of files) {
    const normalizedFile = normalizeFsPath(file)
    const parts = normalizedFile.split('/locales/')
    const afterLocales = parts[1]
    if (!afterLocales) continue

    if (afterLocales.includes('/')) {
      throw new Error(
        `[i18n] Invalid page locales file "${normalizedFile}". ${label} only allows "locales/<locale>.ts".`,
      )
    }

    if (!locales.includes(stripExtension(basename(afterLocales)))) {
      throw new Error(
        `[i18n] Invalid page locales file "${normalizedFile}". ${label} only allows configured locale files.`,
      )
    }
  }
}

function scanSrcLocales(root: string, locales: string[]) {
  const sources: LocaleSource[] = []

  for (const locale of locales) {
    const files = globSync(`src/locales/${locale}/**/*.ts`, { cwd: root })

    for (const file of files) {
      const relativeFile = normalizeFsPath(file)
      const withinLocale = relativeFile.slice(`src/locales/${locale}/`.length)
      if (withinLocale === 'index.ts') continue

      const namespaceSegments = normalizeNamespaceSegments(stripExtension(withinLocale).split('/'))

      if (namespaceSegments.length === 0) continue

      sources.push(toLocaleSource(root, relativeFile, locale, 'src-locales', namespaceSegments))
    }
  }

  return sources
}

function scanSrcPages(root: string, locales: string[]) {
  validatePageLocaleFiles(root, 'src/pages/**/locales/**/*.ts', locales, 'src/pages')
  const sources: LocaleSource[] = []

  for (const locale of locales) {
    const files = globSync(`src/pages/**/locales/${locale}.ts`, { cwd: root })

    for (const file of files) {
      const relativeFile = normalizeFsPath(file)
      const namespacePath = relativeFile
        .replace(/^src\/pages\//, '')
        .replace(new RegExp(`/locales/${locale}\\.ts$`), '')
      const namespaceSegments = normalizeNamespaceSegments(namespacePath.split('/').filter(Boolean))

      sources.push(toLocaleSource(root, relativeFile, locale, 'src-pages', namespaceSegments))
    }
  }

  return sources
}

function scanAppLocales(root: string, locales: string[]) {
  const sources: LocaleSource[] = []

  for (const locale of locales) {
    const files = globSync(`apps/*/locales/${locale}/**/*.ts`, { cwd: root })

    for (const file of files) {
      const relativeFile = normalizeFsPath(file)
      const segments = relativeFile.split('/')
      const appName = segments[1]
      const localeIndex = segments.indexOf(locale)
      const withinLocale = segments.slice(localeIndex + 1).join('/')
      const namespaceSegments = normalizeNamespaceSegments([
        appName,
        ...stripExtension(withinLocale).split('/'),
      ])

      if (namespaceSegments.length === 0) continue

      sources.push(
        toLocaleSource(root, relativeFile, locale, 'app-locales', namespaceSegments, appName),
      )
    }
  }

  return sources
}

function scanAppPages(root: string, locales: string[]) {
  validatePageLocaleFiles(root, 'apps/*/pages/**/locales/**/*.ts', locales, 'apps/*/pages')
  const sources: LocaleSource[] = []

  for (const locale of locales) {
    const files = globSync(`apps/*/pages/**/locales/${locale}.ts`, { cwd: root })

    for (const file of files) {
      const relativeFile = normalizeFsPath(file)
      const segments = relativeFile.split('/')
      const appName = segments[1]
      const prefix = `apps/${appName}/pages/`
      const namespacePath = relativeFile
        .replace(prefix, '')
        .replace(new RegExp(`/locales/${locale}\\.ts$`), '')
      const namespaceSegments = normalizeNamespaceSegments([
        appName,
        ...namespacePath.split('/').filter(Boolean),
      ])

      sources.push(
        toLocaleSource(root, relativeFile, locale, 'app-pages', namespaceSegments, appName),
      )
    }
  }

  return sources
}

export function scanLocaleSources(root: string, options: ResolvedI18nPluginOptions) {
  const sources: LocaleSource[] = []

  if (options.include.srcLocales) sources.push(...scanSrcLocales(root, options.locales))
  if (options.include.srcPages) sources.push(...scanSrcPages(root, options.locales))
  if (options.include.appLocales) sources.push(...scanAppLocales(root, options.locales))
  if (options.include.appPages) sources.push(...scanAppPages(root, options.locales))

  return sources.sort(sortSources)
}

export function describeSourceForError(root: string, source: LocaleSource) {
  return `${source.locale}:${source.namespaceSegments.join('.')} (${toRelativeRootPath(root, source.filePath)})`
}
