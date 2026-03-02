import type { RoutesFolder } from 'vue-router/dist/unplugin/index.mjs'

export function loadRouter() {
  return [
    {
      src: 'src/pages',
      path: file => file.slice(file.lastIndexOf('src/pages') + 'src/pages'.length),
      exclude: [
        '**/components',
        '**/hooks',
        '**/composables',
      ],
    },
  ] as RoutesFolder
}
