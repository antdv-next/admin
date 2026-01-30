import vue from '@vitejs/plugin-vue'
import { nitro } from 'nitro/vite'
import unocss from 'unocss/vite'
import autoImport from 'unplugin-auto-import/vite'
import components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import dayjs from 'vite-plugin-dayjs'
import vueRouter from 'vue-router/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    unocss(),
    dayjs(),
    nitro(),
    autoImport({
      dts: 'types/auto-imports.d.ts',
      imports: [
        'vue',
        'vue-router',
        '@vueuse/core',
        'vue-i18n',
      ],
    }),
    components({
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
