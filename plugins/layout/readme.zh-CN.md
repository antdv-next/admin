# Layout 插件

`plugins/layout` 用于给 `vue-router/auto-routes` 生成的路由自动包裹布局，支持：

- 全局布局（如 `src/pages/**`）
- 模块布局（如 `/admin/**`）
- 基于路由前缀的模块覆盖配置
- 可配置的回退策略
- 自动生成布局类型（`types/layout-generated.d.ts`）

## 快速开始

```ts
// plugins/index.ts
import vueRouter from 'vue-router/vite'
import { layout } from './layout'
import { loadRouter } from './router'

const layoutOptions = {
  layoutDirs: ['src/layouts', 'apps/*/layouts'],
  defaultLayout: 'default',
  globalFallbackLayout: false,
  modules: {
    admin: {
      // 可选：覆盖模块名，布局 key 走 admin/**
      module: 'admin',
      // 可选：显式默认布局
      // layout: 'admin/base',
      // 可选：模块默认布局不存在时的回退
      fallbackLayout: false,
    },
  },
  exclude: ['**/components/**', '**/hooks/**', '**/composables/**'],
} as const

export function loadPlugins() {
  return [
    vueRouter({
      dts: 'types/vue-router.d.ts',
      routesFolder: loadRouter(layoutOptions),
    }),
    layout(layoutOptions),
  ]
}
```

## 目录约定

布局 key 由布局文件路径生成，规则是：

- 去掉 `.vue`
- 去掉末尾 `/index`

示例：

- `src/layouts/default/index.vue` -> `default`
- `apps/admin/layouts/base/index.vue` -> `admin/base`
- `foo/layouts/default.vue` -> `foo/default`

### 模块名如何推断

`layoutDirs` 推荐使用以下形式：

- `src/layouts`：全局布局目录
- `apps/*/layouts`：通配模块布局目录
  - 默认模块名 = `*` 匹配到的目录名（例如 `admin`）
- `xxx/layouts`：静态模块布局目录
  - 默认模块名 = `xxx` 的最后一段（例如 `xxx`）

如果配置了 `modules[routePrefix].module`，会覆盖上述默认模块名。

## `LayoutPluginOptions` 配置项

```ts
interface LayoutPluginOptions {
  defaultLayout?: string
  globalFallbackLayout?: string | false
  modules?: Record<
    string,
    {
      module?: string
      layout?: string
      fallbackLayout?: string | false
    }
  >
  layoutDirs?: string | string[]
  exclude?: string | string[]
  importMode?: 'sync' | 'async'

  // 兼容旧配置
  fallbackToGlobalDefault?: boolean
}
```

说明：

- `globalFallbackLayout` 只作用于模块路由，当模块默认布局不存在时生效。
- `fallbackToGlobalDefault` 已废弃，内部映射为：
  - `false` -> `globalFallbackLayout = false`
  - 其他情况 -> `globalFallbackLayout = defaultLayout`

## 布局匹配优先级

对每个路由按以下顺序处理：

1. `meta.layout === false` -> 不使用布局
2. `meta.layout` 为非空字符串 -> 直接使用
3. 如果是模块路由：
4. `modules[routePrefix].layout`（存在且文件可解析时）
5. `${moduleName}/${defaultLayout}`（`moduleName` 来自 `modules[routePrefix].module` 或路由前缀）
6. `modules[routePrefix].fallbackLayout ?? globalFallbackLayout`
7. 非模块路由 -> 使用 `defaultLayout`

如果最终 layout key 对应不到实际布局组件，则不会包裹布局。

## 路由前缀与模块映射

- 路由前缀 = 路径第一段（如 `/admin/user` -> `admin`）
- `modules` 的 key 就是路由前缀
- 示例：
  - `modules.admin.module = 'backoffice'`
  - `/admin/**` 的默认布局会匹配 `backoffice/default`

## 与 `loadRouter()` 联动

`loadRouter(layoutOptions)` 会基于同一份配置自动生成 `RoutesFolder`，避免 router 和 layout 各配一套目录。

它会根据 `layoutDirs` 推导路由来源：

- 全局来源 -> `${rootDir}/pages`
- 通配模块来源 -> `${rootDir}` + `*/pages/**`
- 静态模块来源 -> `${rootDir}/pages`，并加上推断出的模块前缀

## 类型文件生成

插件会生成：

- `types/layout-generated.d.ts`

其中包含扫描到的布局 key，以及配置中显式声明的布局 key（如模块显式 layout/fallback）。

## 自定义 Icons

Vite 插件层会复用同一套 source 发现逻辑，通过 `unplugin-icons` 暴露本地 SVG 图标。

主应用图标放在 `src/assets/icons` 的一级 collection 目录下：

```text
src/assets/icons/
  common/
    logo.svg
  nav/
    home.svg
```

导入方式：

- `~icons/common/logo`
- `~icons/nav/home`

子应用图标放在 `apps/<name>/assets/icons` 下，每个子应用会映射成一个独立 collection：

```text
apps/admin/assets/icons/
  logo.svg
  nav/home.svg
```

导入方式：

- `~icons/app-admin/logo`
- `~icons/app-admin/nav/home`

说明：

- 主应用图标的 collection 名来自 `src/assets/icons` 下的一级目录名
- 子应用图标固定使用 `app-<name>` 作为 collection
- 图标导入路径不依赖路由前缀、布局别名或 `modules[...].module`
