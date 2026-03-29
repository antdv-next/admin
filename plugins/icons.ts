import { existsSync, readdirSync } from 'node:fs'
import { basename, join } from 'node:path'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import type { LayoutPluginOptions } from './layout'
import { resolveLayoutOptions } from './layout/options'

export interface LoadedIcons {
  customCollections: Record<string, ReturnType<typeof FileSystemIconLoader>>
  customCollectionNames: string[]
}

function isDirectory(path: string) {
  return existsSync(path)
}

function collectMainAppCollections(rootDir: string) {
  const iconsRoot = join(rootDir, 'assets/icons')
  if (!isDirectory(iconsRoot)) {
    return []
  }

  return readdirSync(iconsRoot, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => ({
      collection: entry.name,
      dir: join(iconsRoot, entry.name),
    }))
}

function collectStaticModuleCollection(rootDir: string) {
  const iconsRoot = join(rootDir, 'assets/icons')
  if (!isDirectory(iconsRoot)) {
    return null
  }

  return {
    collection: `app-${basename(rootDir)}`,
    dir: iconsRoot,
  }
}

function collectWildcardModuleCollections(rootDir: string) {
  if (!isDirectory(rootDir)) {
    return []
  }

  return readdirSync(rootDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => {
      const moduleRoot = join(rootDir, entry.name)
      const iconsRoot = join(moduleRoot, 'assets/icons')

      if (!isDirectory(iconsRoot)) {
        return null
      }

      return {
        collection: `app-${entry.name}`,
        dir: iconsRoot,
      }
    })
    .filter(item => item !== null)
}

export function loadIcons(layoutOptions: LayoutPluginOptions = {}): LoadedIcons {
  const { layoutSources } = resolveLayoutOptions(layoutOptions)
  const customCollections: LoadedIcons['customCollections'] = {}
  const customCollectionNames: string[] = []
  const seenCollections = new Set<string>()

  const registerCollection = (collection: string, dir: string) => {
    if (seenCollections.has(collection)) {
      return
    }

    seenCollections.add(collection)
    customCollectionNames.push(collection)
    customCollections[collection] = FileSystemIconLoader(dir)
  }

  layoutSources.forEach(source => {
    if (source.kind === 'global') {
      collectMainAppCollections(source.rootDir).forEach(({ collection, dir }) => {
        registerCollection(collection, dir)
      })
      return
    }

    if (source.kind === 'module-static') {
      const collection = collectStaticModuleCollection(source.rootDir)
      if (collection) {
        registerCollection(collection.collection, collection.dir)
      }
      return
    }

    collectWildcardModuleCollections(source.rootDir).forEach(({ collection, dir }) => {
      registerCollection(collection, dir)
    })
  })

  return {
    customCollections,
    customCollectionNames,
  }
}
