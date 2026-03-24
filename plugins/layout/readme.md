# Layout Plugin

`plugins/layout` provides route layout wrapping for `vue-router/auto-routes` and supports:

- global layouts (for `src/pages/**`)
- module layouts (for routes like `/admin/**`)
- route-prefix-based module overrides
- configurable fallback behavior
- generated layout type definitions (`types/layout-generated.d.ts`)

## Quick Start

```ts
// plugins/index.ts
import vueRouter from 'vue-router/vite';
import { layout } from './layout';
import { loadRouter } from './router';

const layoutOptions = {
  layoutDirs: ['src/layouts', 'apps/*/layouts'],
  defaultLayout: 'default',
  globalFallbackLayout: false,
  modules: {
    admin: {
      // optional override: use layout keys under "admin/**"
      module: 'admin',
      // optional explicit default layout
      // layout: 'admin/base',
      // optional module fallback when default is missing
      fallbackLayout: false,
    },
  },
  exclude: ['**/components/**', '**/hooks/**', '**/composables/**'],
} as const;

export function loadPlugins() {
  return [
    vueRouter({
      dts: 'types/vue-router.d.ts',
      routesFolder: loadRouter(layoutOptions),
    }),
    layout(layoutOptions),
  ];
}
```

## Directory Conventions

Layout keys are generated from layout file paths:

- remove `.vue`
- remove trailing `/index`

Examples:

- `src/layouts/default/index.vue` -> `default`
- `apps/admin/layouts/base/index.vue` -> `admin/base`
- `foo/layouts/default.vue` -> `foo/default`

### How module names are detected

`layoutDirs` supports these useful forms:

- `src/layouts`: global layouts
- `apps/*/layouts`: wildcard module layouts
  - auto module name = directory segment matched by `*` (example: `admin`)
- `xxx/layouts`: static module layout root
  - auto module name = last segment of `xxx` (example: `xxx`)

If `modules[routePrefix].module` is configured, it overrides the auto module name.

## `LayoutPluginOptions`

```ts
interface LayoutPluginOptions {
  defaultLayout?: string;
  globalFallbackLayout?: string | false;
  modules?: Record<
    string,
    {
      module?: string;
      layout?: string;
      fallbackLayout?: string | false;
    }
  >;
  layoutDirs?: string | string[];
  exclude?: string | string[];
  importMode?: 'sync' | 'async';

  // backward compatibility
  fallbackToGlobalDefault?: boolean;
}
```

Notes:

- `globalFallbackLayout` applies only to module routes when module default layout is missing.
- `fallbackToGlobalDefault` is deprecated. It is mapped to:
  - `false` -> `globalFallbackLayout = false`
  - otherwise -> `globalFallbackLayout = defaultLayout`

## Layout Resolution Order

For each route:

1. `meta.layout === false` -> disable layout
2. `meta.layout` is a non-empty string -> use it directly
3. if route is a module route:
4. `modules[routePrefix].layout` (if exists and file is found)
5. `${moduleName}/${defaultLayout}` (moduleName from `modules[routePrefix].module` or route prefix)
6. `modules[routePrefix].fallbackLayout ?? globalFallbackLayout`
7. for non-module routes -> `defaultLayout`

If a resolved layout key is not found, layout wrapping is skipped.

## Route Prefix and Module Mapping

- route prefix = first path segment (e.g. `/admin/user` -> `admin`)
- `modules` key is the route prefix
- example:
  - `modules.admin.module = 'backoffice'`
  - `/admin/**` defaults to `backoffice/default`

## Integration with `loadRouter()`

`loadRouter(layoutOptions)` builds `RoutesFolder` from the same layout source config.

This avoids duplicated folder configuration between router and layout plugin.

Generated route sources are inferred from `layoutDirs`:

- global source -> `${rootDir}/pages`
- wildcard module source -> `${rootDir}` + `*/pages/**`
- static module source -> `${rootDir}/pages` prefixed by inferred module route prefix

## Generated Types

The plugin generates:

- `types/layout-generated.d.ts`

It includes discovered layout keys plus configured explicit/fallback layout keys.
