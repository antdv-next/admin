import type { UserConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import { loadPlugins } from './plugins'
import { loadAlias } from './plugins/alisa.ts'
import { loadSever } from './plugins/server.ts'

const baseUrl = fileURLToPath(new URL('./', import.meta.url))

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, baseUrl)
  return {
    base: env.VITE_BASE_PATH ?? '/',
    plugins: loadPlugins(mode, baseUrl),
    resolve: {
      alias: loadAlias(baseUrl),
    },
    server: loadSever(mode, baseUrl),
  } as UserConfig
})
