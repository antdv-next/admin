import { AntdvNextResolver } from '@antdv-next/auto-import-resolver'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { nitro } from 'nitro/vite'
import autoImport from 'unplugin-auto-import/vite'
import components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import dayjs from 'vite-plugin-dayjs'
import vueRouter from 'vue-router/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    dayjs(),
    nitro(),
    autoImport({
      dirs: [],
      dts: 'types/auto-imports.d.ts',
      imports: [
        'vue',
        'vue-router',
        '@vueuse/core',
        'vue-i18n',
      ],
    }),
    components({
      dirs: [],
      resolvers: [AntdvNextResolver()],
      dts: 'types/components.d.ts',
    }),
    vueRouter({
      dts: 'types/vue-router.d.ts',
      exclude: [
        'src/pages/**/components/**',
      ],
    }),
  ],
  nitro: {
    serverDir: './server',
  },
  resolve: {
    tsconfigPaths: true,
  },
})
