# Sub App Routing

## What Counts As A Sub App

- A sub app lives under `apps/<app-name>/`.
- It can define its own `pages`, `layouts`, and `stores`.
- It is discovered by the existing router and layout plugins. No extra registration is needed for the default case.

## Directory Shape

```text
apps/
  admin/
    api/
    assets/
      icons/
    layouts/
      default/index.vue
      base/index.vue
    pages/
      index.vue
      user.vue
      user/
        index.vue
        center.vue
    stores/
      ...
```

## Route Discovery Rules

The router plugin reads:

- global pages from `src/pages/**`
- module pages from `apps/*/pages/**`

For `apps/*/pages/**`, the app folder name becomes the route prefix.

Examples:

- `apps/admin/pages/index.vue` -> `/admin`
- `apps/admin/pages/user/index.vue` -> `/admin/user`
- `apps/admin/pages/user/center.vue` -> `/admin/user/center`

This comes from `plugins/router.ts`, which rewrites:

- `apps/<name>/pages/...`
- to `<name>/...`

## Shared Second-Level Page Shells

When a route segment like `/admin/user/**` needs shared UI for multiple child pages, prefer
Vue Router's file-based nested routes instead of extending the layout plugin.

Use this structure:

```text
apps/admin/pages/
  user.vue
  user/
    index.vue
    center.vue
    profile.vue
```

This produces:

- `apps/admin/pages/user.vue` -> parent shell route `/admin/user`
- `apps/admin/pages/user/index.vue` -> default child route `/admin/user`
- `apps/admin/pages/user/center.vue` -> child route `/admin/user/center`
- `apps/admin/pages/user/profile.vue` -> child route `/admin/user/profile`

The expected render tree is:

```text
admin/default
  -> user.vue
    -> index.vue | center.vue | profile.vue
```

Guidance:

- keep `apps/<app-name>/layouts/default/index.vue` as the outer module layout
- use `apps/<app-name>/pages/<segment>.vue` as the shared shell for that URL segment
- render child pages through `<RouterView />` inside the shell page
- put shared headers, tabs, summaries, and secondary navigation in the shell page
- keep child pages focused on their own content area

Do not try to model this as a second automatic layout layer like `admin/default + admin/user`.
The current layout plugin resolves one layout key for the route prefix and is intended for the
outer module shell, not per-segment nested business shells.

For access control on this pattern, also read `references/router-access.md`.

## When A User Asks To Create A New Sub App

Use a short Q&A flow instead of creating a module silently.

Default first question:

- `你要创建的子应用名字是什么？`

If the user does not provide more constraints, initialize the minimum usable structure under
`apps/<app-name>/`:

```text
apps/
  <app-name>/
    layouts/
      default/
        index.vue
    pages/
      index.vue
```

If the user wants a slightly more complete starting point, prefer this base structure:

```text
apps/
  <app-name>/
    assets/
      icons/
        logo.svg
    layouts/
      default/
        index.vue
    pages/
      index.vue
    stores/
```

Use this expanded scaffold when the sub app is expected to have:

- its own local SVG icons
- independent state
- a recognizable app shell instead of a throwaway demo page
- stable app-local imports that should not rely on long relative paths

If the app also needs a stable absolute import alias, read `references/sub-app-aliases.md`.

## Purpose Of The Default Structure

- `apps/<app-name>/pages/index.vue`
  This creates the route entry for `/<app-name>`.
- `apps/<app-name>/layouts/default/index.vue`
  This provides the module default layout key `<app-name>/default`, so routes in this sub app can be wrapped automatically by the layout plugin.

## Purpose Of The Expanded Base Structure

- `apps/<app-name>/assets/icons`
  This is the local icon root for the sub app and maps to imports under `~icons/app-<app-name>/*`.
- `apps/<app-name>/stores`
  This is the local store area for sub-app-specific state and follows the existing `apps/*/stores` auto-import convention.
- `apps/<app-name>/pages/index.vue`
  This creates the route entry for `/<app-name>`.
- `apps/<app-name>/layouts/default/index.vue`
  This provides the default shell for the sub app and keeps the route/layout discovery rules aligned with the existing plugin behavior.

## Default Response Pattern

After the user gives the app name, respond with the structure and purpose before or while creating it:

- `我会先初始化一个基础子应用结构，至少包含 apps/<app-name>/pages/index.vue 和 apps/<app-name>/layouts/default/index.vue。`
- `如果这个子应用一开始就会有本地图标或独立状态，我会一起补上 apps/<app-name>/assets/icons 和 apps/<app-name>/stores。`
- `如果这个子应用需要稳定的绝对导入路径，我也会同步更新相关 alias 配置。`
- `这样做的目的是先让 /<app-name> 路由可用，同时让这个子应用自动命中 <app-name>/default 作为默认布局，并保留后续扩展空间。`
