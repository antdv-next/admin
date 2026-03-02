declare module 'virtual:layout' {
  import type { Router, RouteRecordRaw } from 'vue-router'

  export function setupLayouts(routes: readonly RouteRecordRaw[]): RouteRecordRaw[]

  export function createGetRoutes(
    router: Router,
    withLayout?: boolean,
  ): ReturnType<Router['getRoutes']> | (() => ReturnType<Router['getRoutes']>)
}
