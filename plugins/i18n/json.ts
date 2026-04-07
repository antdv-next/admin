import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { mergeMessageTrees } from './merge'
import type { I18nPluginJsonOptions, ResolvedI18nPluginOptions } from './options'
import type { LocaleSource } from './scan'

export interface LocaleModuleRecord {
  namespaceSegments: string[]
  value: Record<string, unknown>
}

export interface LocaleJsonOutput {
  locale: string
  filePath: string
  content: string
}

function wrapNamespace(namespaceSegments: string[], value: Record<string, unknown>) {
  if (namespaceSegments.length === 0) return value

  return namespaceSegments.reduceRight<Record<string, unknown>>((accumulator, segment) => {
    return {
      [segment]: accumulator,
    }
  }, value)
}

export function buildLocaleMessages(records: LocaleModuleRecord[]) {
  return records.reduce<Record<string, unknown>>((accumulator, record) => {
    return mergeMessageTrees(accumulator, wrapNamespace(record.namespaceSegments, record.value))
  }, {})
}

function sortSources(left: LocaleSource, right: LocaleSource) {
  return (
    left.locale.localeCompare(right.locale) ||
    left.namespaceSegments.join('.').localeCompare(right.namespaceSegments.join('.')) ||
    left.filePath.localeCompare(right.filePath)
  )
}

export function createLocaleJsonOutputs(
  sources: LocaleSource[],
  moduleMap: Map<string, Record<string, unknown>>,
  jsonOptions: Required<I18nPluginJsonOptions>,
) {
  const localeGroups = new Map<string, LocaleModuleRecord[]>()

  for (const source of [...sources].sort(sortSources)) {
    const value = moduleMap.get(source.filePath)
    if (!value) {
      throw new Error(`[i18n] Missing locale module value for "${source.filePath}".`)
    }

    const group = localeGroups.get(source.locale)
    const record = {
      namespaceSegments: source.namespaceSegments,
      value,
    }

    if (group) {
      group.push(record)
      continue
    }

    localeGroups.set(source.locale, [record])
  }

  return [...localeGroups.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([locale, records]) => {
      const filePath = `${jsonOptions.outDir}/${jsonOptions.fileName(locale)}`
      const content = `${JSON.stringify(buildLocaleMessages(records), null, 2)}\n`

      return {
        locale,
        filePath,
        content,
      }
    })
}

export async function loadLocaleModules(sources: LocaleSource[]) {
  const moduleMap = new Map<string, Record<string, unknown>>()

  for (const source of sources) {
    const imported = (await import(pathToFileURL(source.filePath).href)) as {
      default?: Record<string, unknown>
    }
    moduleMap.set(source.filePath, imported.default ?? {})
  }

  return moduleMap
}

export async function generateLocaleJsonFiles(
  root: string,
  sources: LocaleSource[],
  options: Pick<ResolvedI18nPluginOptions, 'json'>,
) {
  if (!options.json) return []

  const moduleMap = await loadLocaleModules(sources)
  const outputs = createLocaleJsonOutputs(sources, moduleMap, options.json)

  await Promise.all(
    outputs.map(async output => {
      const outputPath = resolve(root, output.filePath)
      await mkdir(dirname(outputPath), { recursive: true })
      await writeFile(outputPath, output.content, 'utf8')
    }),
  )

  return outputs
}
