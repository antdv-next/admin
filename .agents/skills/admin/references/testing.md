# Testing

## Test Placement

- Place tests under `__tests__` instead of next to source files when following this repo's current preference.

## Vite Plus Imports

- Import test APIs from `vite-plus/test`, not `vitest`.
- Use `vp test`, not direct `vitest` commands.
- Prefer `vp check` as the default validation entry for this repo.

## TypeScript Projects

- App code is checked by `tsconfig.app.json`.
- Test code is checked by `tsconfig.test.json`.
- Root project references both app and test configs from `tsconfig.json`.

## Current Commands

- Default validation:
  `vp check`
- Targeted tests:
  `vp test --run --config vitest.config.ts <test-file>`
- Use lower-level `tsc` or `vue-tsc` commands only when debugging project-config issues.

## Current Config Files

- `vitest.config.ts`
- `tsconfig.test.json`
- `tsconfig.app.json`
- `tsconfig.json`
