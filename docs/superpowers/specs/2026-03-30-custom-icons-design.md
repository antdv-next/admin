# Custom Icons Design

**Date:** 2026-03-30

**Goal:** Add a consistent custom icon loading model for the main app and all sub-apps, based on `unplugin-icons`, without coupling icon imports to layout aliases or route config.

## Context

The repo already centralizes sub-app discovery through `layoutOptions` and shared source resolution:

- `plugins/index.ts` builds one `layoutOptions` object.
- `loadRouter(layoutOptions)` uses those sources to discover route folders.
- `layout(layoutOptions)` uses the same sources to discover layouts.

Custom icons should follow the same discovery model so the main app and every sub-app can expose local SVG icons without manual per-app Vite configuration.

## Scope

This change only covers icon infrastructure:

- discover icon directories for the main app and sub-apps
- expose a `loadIcons()` helper for Vite plugin setup
- register `unplugin-icons` and its resolver
- support explicit imports and optional auto-imported icon components

This change does **not** include menu icon rendering or any other consumer-side mapping logic.

## Requirements

### Main app icons

Main app icons live under:

`src/assets/icons`

The main app uses the native `unplugin-icons` collection model. The first-level directory under `src/assets/icons` is the collection name.

Example:

```text
src/assets/icons/
  common/
    logo.svg
  nav/
    home.svg
```

Imports:

- `~icons/common/logo`
- `~icons/nav/home`

Constraint:

- files must not be placed directly under `src/assets/icons`
- the first directory segment is required because `unplugin-icons` expects `~icons/{collection}/{icon}`

### Sub-app icons

Each sub-app may define local icons under:

`apps/<app-name>/assets/icons`

Each sub-app icon directory maps to exactly one custom collection:

- `apps/admin/assets/icons` -> `app-admin`
- `apps/crm/assets/icons` -> `app-crm`

Examples:

```text
apps/admin/assets/icons/
  logo.svg
  nav/home.svg
```

Imports:

- `~icons/app-admin/logo`
- `~icons/app-admin/nav/home`

This avoids collisions between:

- main app icons and sub-app icons
- different sub-apps with the same file names
- local custom collections and third-party Iconify collections

## Naming rules

### Main app

- collection name comes from `src/assets/icons/<collection>`
- collection names should avoid obvious third-party collection names such as `mdi` or `carbon`

### Sub-apps

- collection name is always `app-<appName>`
- the app folder name is the source of truth
- icon naming is based on the file path relative to `assets/icons`

This intentionally does not depend on:

- `modules[routePrefix].module`
- layout key aliases
- route prefix remapping

Changing layout or router aliases must not change icon import paths.

## Design

### `loadIcons()` responsibilities

Create a dedicated icon loader helper that reuses layout source discovery but does not participate in layout resolution.

Expected responsibilities:

1. Read `layoutOptions`
2. Resolve layout sources through the existing shared source logic
3. Derive icon roots for the main app and sub-apps
4. Build `customCollections` for `unplugin-icons`
5. Build `customCollectionNames` for `IconsResolver`

Suggested return shape:

```ts
interface LoadedIcons {
  customCollections: Record<string, unknown>
  customCollectionNames: string[]
}
```

### Discovery rules

#### Main app

When a global source rooted at `src` exists:

- inspect `src/assets/icons/*`
- each first-level directory becomes a custom collection
- each collection uses a filesystem loader rooted at that directory

Example mapping:

- `src/assets/icons/common` -> collection `common`
- `src/assets/icons/nav` -> collection `nav`

#### Sub-apps

For module sources discovered from `apps/*/layouts`:

- derive the app root, such as `apps/admin`
- derive the icon root `apps/admin/assets/icons`
- register one collection per app, named `app-admin`

Nested paths under the icon root remain part of the icon name.

## Vite integration

`plugins/index.ts` should:

1. keep building one shared `layoutOptions` object
2. call `loadIcons(layoutOptions)`
3. register `Icons()` with the returned `customCollections`
4. register `IconsResolver()` with the returned `customCollectionNames`

This keeps router, layout, and icon discovery aligned without duplicating app source configuration.

## Type support

TypeScript should include `unplugin-icons/types/vue` so imports such as `~icons/common/logo` and `~icons/app-admin/logo` resolve correctly in Vue SFCs.

## Non-goals

- no automatic migration of existing `@antdv-next/icons` usage
- no menu data to icon component mapping
- no route meta or layout meta icon behavior
- no icon cleanup pipeline beyond the default filesystem loader behavior

## Expected outcome

After the change:

- the main app can add icons under `src/assets/icons/<collection>/*.svg`
- any sub-app can add icons under `apps/<name>/assets/icons/**/*.svg`
- Vite automatically exposes them through `unplugin-icons`
- import paths remain stable even if layout or route aliases change
