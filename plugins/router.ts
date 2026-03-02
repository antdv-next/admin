import type { RoutesFolder } from 'vue-router/unplugin'

const commonExclude = [
  '**/components/**',
  '**/hooks/**',
  '**/composables/**',
]

function normalizePath(filePath: string) {
  return filePath.replaceAll('\\', '/')
}

function toRelativePath(filePath: string, prefix: string) {
  const normalizedPath = normalizePath(filePath)
  const normalizedPrefix = `${normalizePath(prefix).replace(/\/+$/, '')}/`
  const index = normalizedPath.lastIndexOf(normalizedPrefix)

  if (index === -1)
    return normalizedPath

  return normalizedPath.slice(index + normalizedPrefix.length)
}

export function loadRouter(): RoutesFolder {
  return [
    {
      src: 'src/pages',
      path: (filePath: string) => toRelativePath(filePath, 'src/pages'),
      exclude: [
        ...commonExclude,
        'src/pages/error/**',
        'src/pages/index.vue',
        'src/pages/auth/**',
      ],
    },
    {
      src: 'apps',
      filePatterns: ['*/pages/**'],
      // apps/admin/pages/index.vue -> admin/index.vue
      path: (filePath: string) => {
        const routePath = toRelativePath(filePath, 'apps')
        return routePath.replace(/^([^/]+)\/pages\//, '$1/')
      },
      exclude: commonExclude,
    },
  ]
}
