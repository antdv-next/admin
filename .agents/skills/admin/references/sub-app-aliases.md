# Sub App Aliases

## Import Alias Guidance

If a new sub app needs a stable absolute import alias, update both:

- `tsconfig.app.json`
- `plugins/alias.ts`

Recommended convention:

- `@app/<app-name>/*` -> `apps/<app-name>/*`

Examples:

- `@app/admin/layouts/default` -> `apps/admin/layouts/default`
- `@app/admin/pages/index.vue` -> `apps/admin/pages/index.vue`

Why this convention is better:

- it matches the actual sub-app directory shape under `apps/<app-name>`
- it does not assume a nested `src/` directory inside each sub app
- it works for layouts, pages, stores, assets, and future app-local files

Do not copy the old `@apps/admin/* -> apps/admin/src/*` pattern into new apps unless the app actually has its own `src/` root.

## When To Add An Alias

Add a stable alias when:

- the sub app is expected to grow beyond a few files
- long relative imports are becoming noisy
- the app needs app-local imports across pages, layouts, stores, assets, and helpers

If you are scaffolding a new sub app and it needs a stable alias from day one, update the alias config as part of the same change.

## Example Config

```json
// tsconfig.app.json
{
  "compilerOptions": {
    "paths": {
      "@app/<app-name>/*": ["./apps/<app-name>/*"]
    }
  }
}
```

```ts
// plugins/alias.ts
{
  find: '@app/<app-name>',
  replacement: path.resolve(baseUrl, 'apps/<app-name>'),
}
```
