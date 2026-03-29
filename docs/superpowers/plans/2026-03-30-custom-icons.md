# Custom Icons Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `unplugin-icons` based custom icon discovery for `src/assets/icons` and `apps/*/assets/icons`, with stable import rules for the main app and sub-apps.

**Architecture:** Reuse the existing `layoutOptions` source discovery to derive icon roots, but keep icon registration independent from router and layout aliases. Main app collections come from first-level folders under `src/assets/icons`, while each sub-app gets one namespaced collection `app-<name>` rooted at `apps/<name>/assets/icons`.

**Tech Stack:** Vite Plus, Vue 3, TypeScript, `unplugin-icons`, `unplugin-vue-components`, `vite-plus/test`

---

### Task 1: Add icon discovery helper and types

**Files:**

- Create: `plugins/icons.ts`
- Modify: `plugins/layout/types.ts`
- Test: `src/router/__tests__/icons-plugin.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `src/router/__tests__/icons-plugin.spec.ts` with cases that verify:

```ts
import { describe, expect, it } from 'vite-plus/test'
import { loadIcons } from '../../../plugins/icons'

describe('loadIcons', () => {
  it('maps main app icon collection folders and sub-app icon roots to custom collections', () => {
    const loaded = loadIcons({
      globalFallbackLayout: false,
      exclude: ['**/components/**', '**/hooks/**', '**/composables/**'],
    })

    expect(loaded.customCollectionNames).toContain('app-admin')
  })
})
```

Add expectations for:

- main app collection names discovered from `src/assets/icons/*`
- sub-app collection name `app-admin`
- no dependence on `modules[...].module` overrides

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
vp test --run --config vitest.config.ts src/router/__tests__/icons-plugin.spec.ts
```

Expected:

- FAIL because `plugins/icons.ts` and `loadIcons()` do not exist yet

- [ ] **Step 3: Add icon option types**

In `plugins/layout/types.ts`, add a small reusable type for icon source output, for example:

```ts
export interface LoadedIcons {
  customCollections: Record<string, ReturnType<typeof FileSystemIconLoader>>
  customCollectionNames: string[]
}
```

If importing loader return types makes the file awkward, define the return type in `plugins/icons.ts` instead and keep `plugins/layout/types.ts` unchanged. Do not force icon-specific types into layout-only types unless they improve reuse.

- [ ] **Step 4: Implement `loadIcons()`**

Create `plugins/icons.ts` with focused responsibilities:

- call `resolveLayoutOptions(layoutOptions)`
- collect distinct main app and sub-app roots from `layoutSources`
- inspect `src/assets/icons/*` first-level folders
- register each folder as a collection using `FileSystemIconLoader`
- register each app icon root as `app-<appName>` using `FileSystemIconLoader`
- return `{ customCollections, customCollectionNames }`

Implementation requirements:

- normalize paths the same way as the layout helper code
- skip missing directories without throwing
- deduplicate repeated sources
- keep nested icon paths intact for sub-app imports
- do not use route alias or layout alias to derive collection names

- [ ] **Step 5: Run targeted test to verify it passes**

Run:

```bash
vp test --run --config vitest.config.ts src/router/__tests__/icons-plugin.spec.ts
```

Expected:

- PASS with discovered collection names matching the current workspace

- [ ] **Step 6: Commit**

```bash
git add src/router/__tests__/icons-plugin.spec.ts plugins/icons.ts plugins/layout/types.ts
git commit -m "feat: add custom icon discovery"
```

### Task 2: Wire icon loading into Vite plugins

**Files:**

- Modify: `plugins/index.ts`
- Test: `src/router/__tests__/icons-plugin.spec.ts`

- [ ] **Step 1: Extend the failing test for plugin wiring**

Add assertions or a second test that confirms the shared plugin setup can consume `loadIcons()` output, for example by verifying:

- the resolved custom collection names include current main app collections and `app-admin`
- the returned structure is suitable for both `Icons()` and `IconsResolver()`

If unit testing `loadPlugins()` directly is too coupled to Vite plugin instances, keep the test at the helper contract level and verify integration with a local smoke build in Task 4.

- [ ] **Step 2: Run test to verify the new expectation fails or is missing**

Run:

```bash
vp test --run --config vitest.config.ts src/router/__tests__/icons-plugin.spec.ts
```

Expected:

- either FAIL for the new expectation or indicate the integration path is still unimplemented

- [ ] **Step 3: Register `unplugin-icons` in `plugins/index.ts`**

Update `plugins/index.ts` to:

- import `Icons` from `unplugin-icons/vite`
- import `IconsResolver` from `unplugin-icons/resolver`
- import `loadIcons` from `./icons`
- call `const icons = loadIcons(layoutOptions)`
- register:

```ts
Icons({
  compiler: 'vue3',
  customCollections: icons.customCollections,
})
```

- extend `components()` resolvers with:

```ts
IconsResolver({
  customCollections: icons.customCollectionNames,
})
```

Keep the existing `AntdvNextResolver` in place.

- [ ] **Step 4: Re-run targeted tests**

Run:

```bash
vp test --run --config vitest.config.ts src/router/__tests__/icons-plugin.spec.ts
```

Expected:

- PASS

- [ ] **Step 5: Commit**

```bash
git add plugins/index.ts src/router/__tests__/icons-plugin.spec.ts
git commit -m "feat: wire custom icons into vite plugins"
```

### Task 3: Add TypeScript support for icon imports

**Files:**

- Modify: `tsconfig.app.json`
- Test: `vp check`

- [ ] **Step 1: Add the failing type expectation**

Use an explicit icon import in a temporary or existing checked file only if needed to prove the missing type declaration. Prefer not to leave throwaway code behind. If the type error is already known from configuration, proceed directly.

- [ ] **Step 2: Run validation to confirm the missing type support**

Run:

```bash
vp check
```

Expected:

- type resolution may fail for `~icons/*` imports until the icon type package is declared

- [ ] **Step 3: Add Vue icon types**

Update `tsconfig.app.json`:

```json
"types": ["vite-plus/client", "unplugin-icons/types/vue"]
```

Retain existing types and avoid changing test tsconfig unless it becomes necessary for test imports.

- [ ] **Step 4: Run validation**

Run:

```bash
vp check
```

Expected:

- PASS with `~icons/*` imports recognized in app code

- [ ] **Step 5: Commit**

```bash
git add tsconfig.app.json
git commit -m "chore: add icon import types"
```

### Task 4: Verify with real SVG fixtures and generated component types

**Files:**

- Create: `src/assets/icons/common/.gitkeep` or sample SVG only if the repo has no fixture icons
- Create: `apps/admin/assets/icons/.gitkeep` or sample SVG only if needed for validation
- Test: `types/components.d.ts`

- [ ] **Step 1: Ensure there is at least one main app icon collection and one sub-app icon available for local validation**

If the workspace already has SVG fixtures, use them. If not, create minimal test SVGs:

```text
src/assets/icons/common/logo.svg
apps/admin/assets/icons/logo.svg
```

Use tiny valid SVG content with `currentColor`.

- [ ] **Step 2: Run dev tooling generation**

Run:

```bash
vp check
```

Expected:

- generated declarations succeed
- `types/components.d.ts` can include auto-imported icon component types after plugin resolution runs

- [ ] **Step 3: Smoke-check import paths**

Confirm these imports are valid in a local scratch branch or existing icon consumer:

- `~icons/common/logo`
- `~icons/app-admin/logo`

Do not leave unrelated demo usage in production files unless the feature needs a documented example.

- [ ] **Step 4: Final verification**

Run:

```bash
vp test --run --config vitest.config.ts src/router/__tests__/icons-plugin.spec.ts
vp check
```

Expected:

- both commands PASS

- [ ] **Step 5: Commit**

```bash
git add src/assets/icons apps/admin/assets/icons types/components.d.ts
git commit -m "test: verify custom icon imports"
```

### Task 5: Document the feature for future sub-apps

**Files:**

- Modify: `plugins/layout/readme.zh-CN.md`
- Modify: `plugins/layout/readme.md`

- [ ] **Step 1: Add documentation section**

Document:

- main app icon layout under `src/assets/icons/<collection>`
- sub-app icon layout under `apps/<name>/assets/icons`
- import examples for both
- note that icon paths are independent of route and layout aliases

- [ ] **Step 2: Run validation**

Run:

```bash
vp check
```

Expected:

- PASS

- [ ] **Step 3: Commit**

```bash
git add plugins/layout/readme.md plugins/layout/readme.zh-CN.md
git commit -m "docs: describe custom icon conventions"
```

## Final verification checklist

- [ ] `vp test --run --config vitest.config.ts src/router/__tests__/icons-plugin.spec.ts`
- [ ] `vp check`
- [ ] explicit imports work for `~icons/common/logo`
- [ ] explicit imports work for `~icons/app-admin/logo`
- [ ] auto-import resolver recognizes custom collections without breaking `AntdvNextResolver`

## Notes for execution

- There are unrelated existing changes in the worktree (`apps/admin/layouts/default/components/sider.vue`, `package.json`, `pnpm-lock.yaml`). Do not revert them.
- `unplugin-icons` is already installed, so this plan should not add or change dependencies unless verification proves a missing peer is required.
- Prefer keeping icon discovery in a dedicated helper file instead of expanding `plugins/index.ts` beyond plugin wiring.
