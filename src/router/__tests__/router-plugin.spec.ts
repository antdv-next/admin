import { describe, expect, it } from 'vite-plus/test'
import type { RoutesFolderOption } from 'vue-router/unplugin'
import { loadRouter } from '../../../plugins/router'

describe('loadRouter', () => {
  it('uses a recursive module pages pattern for apps/*/pages routes', () => {
    const routesFolder = loadRouter({
      globalFallbackLayout: false,
      exclude: ['**/components/**', '**/hooks/**', '**/composables/**'],
    })
    const routeFolders = Array.isArray(routesFolder) ? routesFolder : [routesFolder]

    const moduleWildcardFolder = routeFolders.find(
      (route): route is RoutesFolderOption => typeof route !== 'string' && route.src === 'apps',
    )

    expect(moduleWildcardFolder).toMatchObject({
      src: 'apps',
      filePatterns: ['*/pages/**/*'],
    })
  })
})
