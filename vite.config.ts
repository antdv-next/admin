import type { UserConfig } from 'vite-plus';

import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite-plus';

import { loadPlugins } from './plugins';
import { loadAlias } from './plugins/alias';
import { loadSever } from './plugins/server';

const baseUrl = fileURLToPath(new URL('./', import.meta.url));

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, baseUrl);
  return {
    base: env.VITE_BASE_PATH ?? '/',
    plugins: loadPlugins(mode, baseUrl),
    resolve: {
      alias: loadAlias(baseUrl),
    },
    server: loadSever(mode, baseUrl),
    // devtools: {
    //   enabled: true,
    // },
    build: {
      rolldownOptions: {
        // devtools: {},
      },
    },
    staged: {
      '*.{js,ts,tsx,vue,json,css,less,sass,scss,md}': 'vp check --fix',
    },
  } as UserConfig;
});
