import { AntdvNextResolver } from '@antdv-next/auto-import-resolver'
import tailwindcss from '@tailwindcss/vite'
// import { DevTools } from '@vitejs/devtools'
import vue from '@vitejs/plugin-vue'
import { nitro } from 'nitro/vite'
import autoImport from 'unplugin-auto-import/vite'
import components from 'unplugin-vue-components/vite'
import dayjs from 'vite-plugin-dayjs'
import { loadEnv } from 'vite-plus'
import vueRouter from 'vue-router/vite'

import type { LayoutPluginOptions } from './layout'

import { layout } from './layout'
import { loadRouter } from './router'

export function loadPlugins(mode: string, baseUrl: string) {
  const isProd = mode === 'production'
  const env = loadEnv(mode, baseUrl)
  const layoutOptions: LayoutPluginOptions = {
    globalFallbackLayout: false,
    exclude: ['**/components/**', '**/hooks/**', '**/composables/**'],
  }

  // 需要判断生产环境是否开启nitro
  const plugins = []
  if (!isProd || env.VITE_APP_NITRO_ENABLED === 'true') {
    plugins.push(nitro())
  }
  return [
    // DevTools(),
    vueRouter({
      dts: 'types/vue-router.d.ts',
      routesFolder: loadRouter(layoutOptions),
    }),
    layout(layoutOptions),
    // vue-router的插件必须放在vue插件前面
    vue(),
    tailwindcss(),
    dayjs(),
    ...plugins,
    autoImport({
      dirs: [
        'src/stores',
        'apps/*/stores',
        'src/utils/request/index.ts',
        'src/composables/index.ts',
      ],
      dts: 'types/auto-imports.d.ts',
      imports: ['vue', 'vue-router', '@vueuse/core', 'vue-i18n', 'pinia'],
    }),
    components({
      dirs: [],
      resolvers: [
        AntdvNextResolver({
          resolveIcons: true,
        }),
      ],
      dts: 'types/components.d.ts',
    }),
  ]
}
