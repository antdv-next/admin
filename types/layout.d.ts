declare module 'virtual:layout' {
  import type { Router, RouteRecordRaw } from 'vue-router'

  export interface SetupLayoutsOptions {
    /**
     * Flatten nested routes to a two-level structure (layout + page)
     * to avoid keep-alive duplicate mount issues in nested router-views.
     * @default false
     */
    flatten?: boolean
  }

  export function setupLayouts(
    routes: readonly RouteRecordRaw[],
    options?: SetupLayoutsOptions,
  ): RouteRecordRaw[]

  export function createGetRoutes(
    router: Router,
    withLayout?: boolean,
  ): ReturnType<Router['getRoutes']> | (() => ReturnType<Router['getRoutes']>)
}
