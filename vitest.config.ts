import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'
import autoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite-plus/test/config'

import { loadAlias } from './plugins/alias'

const baseUrl = fileURLToPath(new URL('./', import.meta.url))

export default defineConfig({
  plugins: [
    vue(),
    autoImport({
      dirs: ['src/utils/request/index.ts'],
      imports: ['vue', 'vue-router', '@vueuse/core', 'vue-i18n', 'pinia'],
      dts: false,
    }),
  ],
  resolve: {
    alias: loadAlias(baseUrl),
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
