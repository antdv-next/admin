# Sub App Icons

## Icon Discovery Rules

The Vite plugin setup exposes local SVG icons through `unplugin-icons`.

Main app icons:

- source root: `src/assets/icons`
- the first-level directory is the collection name

Examples:

- `src/assets/icons/common/logo.svg` -> `~icons/common/logo`
- `src/assets/icons/nav/home.svg` -> `~icons/nav/home`

Sub-app icons:

- source root: `apps/<app-name>/assets/icons`
- each sub-app maps to one stable collection: `app-<app-name>`

Examples:

- `apps/admin/assets/icons/logo.svg` -> `~icons/app-admin/logo`
- `apps/admin/assets/icons/nav/home.svg` -> `~icons/app-admin/nav/home`

Important constraints:

- do not put SVG files directly under `src/assets/icons`; the main app must use a first-level collection directory
- do not derive icon imports from `modules[routePrefix].module`, route aliases, or layout aliases
- sub-app icon imports are always based on the physical app folder name

## Third-Party Icon Collections

The current Vite setup also supports standard Iconify collections such as `mdi` and `carbon`.

Browse available third-party collections and icon names at:

- [icones.js.org](https://icones.js.org/)

Examples:

- `~icons/mdi/account-box`
- `~icons/carbon/accessibility`
- `<i-mdi-account-box />`
- `<i-carbon-accessibility />`

Before using a third-party collection, install the matching Iconify JSON package:

```bash
pnpm add -D @iconify-json/mdi @iconify-json/carbon
```

Notes:

- the repo currently does not enable `autoInstall: true`
- third-party collections must be installed explicitly before import
- third-party collections and local custom icons can be used together without special handling

## Practical Usage

- Use `src/assets/icons/<collection>/*.svg` for global custom icons.
- Use `apps/<app-name>/assets/icons/**/*.svg` for sub-app custom icons.
- Use one stable collection per sub-app via `app-<app-name>`.
