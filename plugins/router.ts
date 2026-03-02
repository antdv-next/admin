import type { RoutesFolder } from 'vue-router/dist/unplugin/index.mjs'

export function loadRouter() {
  const commonExclude = [
    '**/components',
    '**/hooks',
    '**/composables',
  ]
  return [
    {
      src: 'src/pages',
      path: (file) => {
        return file.slice(file.lastIndexOf('src/pages') + 'src/pages'.length).slice(1)
      },
      exclude: [
        ...commonExclude,
      ],
    },
    {
      src: 'apps/admin',
      filePatterns: [
        'pages/**',
      ],
      path: (file) => {
        const prefix = 'apps/admin'
        const path = file.slice(file.lastIndexOf(prefix) + prefix.length + 1).replace('pages/', '')
        return `admin/${path}`
      },
      exclude: [
        ...commonExclude,
      ],
    },
  ] as RoutesFolder
}
