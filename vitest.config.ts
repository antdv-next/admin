import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import autoImport from 'unplugin-auto-import/vite'
import dayjs from 'vite-plugin-dayjs'
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
    dayjs(),
  ],
  resolve: {
    alias: loadAlias(baseUrl),
  },
  test: {
    environment: 'jsdom',
    globals: true,
    server: {
      deps: {
        // antdv-next 组件栈需要走 Vite 转换管线，vite-plugin-dayjs 才能把
        // dayjs/plugin/* 的裸子路径导入重写到 dayjs/esm，否则 Node 原生 ESM 解析失败
        inline: [/node_modules[\\/].*(antdv-next|@antdv-next|@v-c)[\\/]/],
      },
    },
  },
})
