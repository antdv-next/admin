# Removing A Sub App

## What Counts As Removing A Sub App

- A sub app usually lives under `apps/<app-name>/`.
- Removing it means stopping route, layout, icon, and store discovery for that app.
- The primary action is deleting `apps/<app-name>/`, then cleaning explicit references that still point to it.

This guidance is for removing a module-style sub app. It is not for deleting the global app under `src/`.

## Why The Removal Starts From The Filesystem

The current router, layout, icon, and store integrations discover sub apps from the physical `apps/<app-name>/` directory.

That means:

- deleting `apps/<app-name>/pages/**` removes the `/<app-name>/**` routes from discovery
- deleting `apps/<app-name>/layouts/**` removes layout keys like `<app-name>/default`
- deleting `apps/<app-name>/assets/icons/**` removes the `app-<app-name>` icon collection
- deleting `apps/<app-name>/stores/**` removes app-local auto-imported stores

Because discovery is filesystem-based, there is usually no central registration entry to remove first.

## Default Q And A Flow

Do not silently delete a sub app. Ask for the app name first.

Default first question:

- `你要移除的子应用名字是什么？`

If the request is ambiguous, confirm the cleanup scope:

- `是只移除 apps/<app-name> 目录，还是连同 alias、菜单、显式路由跳转和测试引用一起清理？`

Default assumption when the user does not narrow the scope:

- remove `apps/<app-name>/`
- remove app-specific alias entries if they exist
- remove obvious direct references that would break the build or leave dead navigation behind
- keep shared code unless it is clearly dedicated to this app

## Primary Removal Targets

Remove the sub-app directory when it exists:

```text
apps/
  <app-name>/
    api/
    assets/
    layouts/
    pages/
    stores/
```

At minimum, check these areas under `apps/<app-name>/`:

- `pages/`
- `layouts/`
- `assets/icons/`
- `stores/`
- `api/`

## Required Follow-Up Cleanup

After deleting `apps/<app-name>/`, search for direct references and remove or update them.

### Alias Config

Check both:

- `tsconfig.app.json`
- `plugins/alias.ts`

Remove any alias entries that point to the deleted app.

Recommended pattern to remove:

- `@app/<app-name>/*` -> `apps/<app-name>/*`

Also check for the legacy pattern that still exists in this repo:

- `@apps/<app-name>/*`

### Icon Imports

Search for:

- `~icons/app-<app-name>/`
- `i-app-<app-name>-`

If those imports were only used by the deleted app, they disappear with the directory. If shared pages still reference them, update or remove those usages.

### Explicit Route And Navigation References

Search for hard-coded paths such as:

- `/<app-name>`
- `/<app-name>/...`

Typical places:

- shared headers and menus
- redirects and route constants
- mock menu seeds
- test fixtures and snapshots

### Layout Keys

Search for:

- `<app-name>/default`
- `<app-name>/...`

This catches explicit `meta.layout` usage or other hard-coded layout keys that no longer exist after removing `apps/<app-name>/layouts/**`.

### Generated And Derived Files

Check generated or tracked outputs that may still mention the app:

- `types/vue-router.d.ts`

If the repo tracks generated route types, regenerate or update them after the app is removed so stale route names do not remain in version control.

## Safe Search Pattern

Before deleting shared references, search broadly for the app name:

```bash
rg -n "<app-name>|@app/<app-name>|@apps/<app-name>|~icons/app-<app-name>|/<app-name>" src apps plugins types mock server
```

Use the search results to decide which files are:

- owned by the sub app and should be removed
- shared but now need edits
- unrelated false positives that should stay

Do not delete shared files just because they mention the app. Update them only when the reference is truly dead after the sub app is gone.

## Default Response Pattern

After the user gives the app name, explain the reverse cleanup before or while editing:

- `我会先移除 apps/<app-name>/，这样路由、布局、图标和 store 的自动发现会一起停止。`
- `然后我会继续清理这个子应用对应的 alias、显式路由跳转、菜单数据、测试和生成类型残留。`
- `如果某些共享文件只是引用了这个子应用，我会改成去掉无效引用，而不是直接删共享文件。`
- `这样做的目的是按新增子应用的反方向回收入口和依赖，避免留下无法访问的菜单、失效 import 或过期类型。`
