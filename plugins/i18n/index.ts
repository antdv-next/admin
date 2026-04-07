import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import type { Plugin } from 'vite-plus'
import { RESOLVED_VIRTUAL_I18N_MODULE_ID, VIRTUAL_I18N_MODULE_ID } from './constants'
import { createI18nDts } from './dts'
import { resolveI18nPluginOptions } from './options'
import type { I18nPluginOptions } from './options'
import { createI18nRuntimeModuleCode } from './runtime'
import { scanLocaleSources } from './scan'

export type { I18nPluginOptions } from './options'

function writeIfChanged(filePath: string, content: string) {
  mkdirSync(dirname(filePath), { recursive: true })

  if (existsSync(filePath)) {
    const current = readFileSync(filePath, 'utf8')
    if (current === content) return
  }

  writeFileSync(filePath, content, 'utf8')
}

export function i18n(userOptions: I18nPluginOptions = {}): Plugin {
  const options = resolveI18nPluginOptions(userOptions)
  let root = process.cwd()
  const shouldGenerateOnStartup = !process.argv.includes('check')

  const getSources = () => scanLocaleSources(root, options)

  const generateTypes = () => {
    if (!options.dts) return

    const content = createI18nDts(getSources(), {
      root,
      dts: options.dts,
      defaultLocale: options.defaultLocale,
      strict: options.strict,
    })
    writeIfChanged(`${root}/${options.dts}`, content)
  }

  return {
    name: 'antdv-next-i18n',
    enforce: 'pre',
    configResolved(config) {
      root = config.root
      if (shouldGenerateOnStartup) generateTypes()
    },
    buildStart() {
      if (shouldGenerateOnStartup) generateTypes()
    },
    configureServer({ moduleGraph, watcher, ws }) {
      watcher.add([
        'src/locales/**/*.ts',
        'src/pages/**/locales/**/*.ts',
        'apps/*/locales/**/*.ts',
        'apps/*/pages/**/locales/**/*.ts',
      ])

      const updateVirtualModule = () => {
        generateTypes()

        const module = moduleGraph.getModuleById(RESOLVED_VIRTUAL_I18N_MODULE_ID)
        if (!module) return

        moduleGraph.invalidateModule(module)
        ws.send({
          type: 'full-reload',
          path: '*',
        })
      }

      watcher.on('add', updateVirtualModule)
      watcher.on('unlink', updateVirtualModule)
      watcher.on('change', updateVirtualModule)
    },
    resolveId(id) {
      if (id === VIRTUAL_I18N_MODULE_ID) return RESOLVED_VIRTUAL_I18N_MODULE_ID
    },
    load(id) {
      if (id !== RESOLVED_VIRTUAL_I18N_MODULE_ID) return
      return createI18nRuntimeModuleCode(getSources(), options.defaultLocale)
    },
  }
}
