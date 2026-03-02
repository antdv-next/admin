import type { Plugin } from 'vite'
import type { LayoutPluginOptions } from './types'
import { RESOLVED_VIRTUAL_MODULE_ID, VIRTUAL_MODULE_ID } from './constants'
import { resolveLayoutOptions } from './options'
import { isLayoutVueFile, toLayoutWatchGlob } from './utils'
import { createVirtualModuleCode } from './virtual-module'

// 本项目 layout 插件基于以下项目改造：
// https://github.com/JohnCampionJr/vite-plugin-vue-layouts#
export type { LayoutPluginOptions } from './types'

export function layout(userOptions: LayoutPluginOptions = {}): Plugin {
  const options = resolveLayoutOptions(userOptions)

  return {
    name: 'antdv-next-layout',
    enforce: 'pre',
    configureServer({ moduleGraph, watcher, ws }) {
      watcher.add(options.layoutDirs.map(toLayoutWatchGlob))

      const updateVirtualModule = (filePath: string) => {
        if (!isLayoutVueFile(filePath))
          return

        const module = moduleGraph.getModuleById(RESOLVED_VIRTUAL_MODULE_ID)
        if (!module)
          return

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
      if (id === VIRTUAL_MODULE_ID)
        return RESOLVED_VIRTUAL_MODULE_ID
    },
    load(id) {
      if (id === RESOLVED_VIRTUAL_MODULE_ID)
        return createVirtualModuleCode(options)
    },
  }
}
