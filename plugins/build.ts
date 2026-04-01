import type { UserConfig } from 'vite-plus'

export const loadBuild = () => {
  return {
    chunkSizeWarningLimit: 1000,
    rolldownOptions: {
      output: {
        codeSplitting: {
          minSize: 20_000,
          groups: [
            {
              name: 'framework',
              test: /node_modules[\\/](vue|vue-router|pinia|vue-i18n|@vueuse[\\/]core)([\\/]|$)/,
              priority: 30,
            },
            {
              name: 'antd-icons',
              test: /node_modules[\\/]@antdv-next[\\/]icons([\\/]|$)/,
              priority: 25,
            },
            {
              name: 'antd',
              test: /node_modules[\\/]antdv-next([\\/]|$)/,
              priority: 20,
            },
            {
              name: 'common',
              minShareCount: 2,
              minSize: 30_000,
              priority: 10,
            },
          ],
        },
      },
    },
  } as NonNullable<UserConfig['build']>
}
