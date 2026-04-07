# I18n Plugin Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a repo-local i18n plugin that scans global and page-level locale files from `src` and `apps/*`, merges them into a stable message tree, generates `types/i18n.d.ts` with complete `vue-i18n` key inference, and optionally emits aggregated locale JSON into `public`.

**Architecture:** Implement the feature as a Vite plugin under `plugins/i18n/` and register it from the existing plugin entry. The plugin should own five responsibilities: source scanning, namespace mapping, deep merge with conflict detection, declaration-file generation via `typeof import('...').default` rather than AST parsing, and optional aggregated JSON emission. Runtime message aggregation should be exposed through generated imports or a virtual module so `src/locales/index.ts` can initialize `vue-i18n` with the collected messages. JSON output can either be emitted by the plugin itself or by a dedicated script that reuses the same scan and merge utilities.

**Tech Stack:** TypeScript, Vite/Vite Plus plugin API, `vue-i18n`, `fast-glob` or `tinyglobby`-style file scanning, Vitest via `vite-plus/test`

---

## Scope

This plan only covers the i18n plugin, generated runtime message aggregation, generated type declarations, and optional aggregated JSON output. It does not include migrating existing pages to use `t()` or rewriting current locale file content.

## Required Rules

- Global locale sources:
  - `src/locales/<locale>/**/*.ts`
  - exclude `src/locales/<locale>/index.ts`
- Global page locale sources:
  - `src/pages/**/locales/<locale>.ts`
- App locale sources:
  - `apps/<app>/locales/<locale>/**/*.ts`
- App page locale sources:
  - `apps/<app>/pages/**/locales/<locale>.ts`
- Namespace mapping:
  - `src/locales/zh-CN/workspace/overview.ts` -> `workspace.overview`
  - `src/locales/zh-CN/workspace/overview/index.ts` -> `workspace.overview`
  - `src/pages/error/locales/zh-CN.ts` -> `error`
  - `src/pages/user/[id]/locales/zh-CN.ts` -> `user.$id`
  - `src/pages/user/[id]/edit/locales/zh-CN.ts` -> `user.$id.edit`
  - `apps/admin/locales/zh-CN/workspace/overview.ts` -> `admin.workspace.overview`
  - `apps/admin/locales/zh-CN/workspace/overview/index.ts` -> `admin.workspace.overview`
  - `apps/admin/pages/error/locales/zh-CN.ts` -> `admin.error`
  - `apps/admin/pages/user/[id]/locales/zh-CN.ts` -> `admin.user.$id`
- Path normalization:
  - a trailing `index` path segment is treated as the default node and should be removed from the final namespace
  - dynamic route segments should be normalized into stable key segments
  - examples:
    - `overview/index.ts` -> `overview`
    - `admin/workspace/overview/index.ts` -> `admin.workspace.overview`
    - `[id]` -> `$id`
    - `[slug]` -> `$slug`
    - `[...all]` -> `$all`
    - `[[id]]` -> `$id`
- `pages/**/locales` only allows one file per locale entry, such as `zh-CN.ts` and `en-US.ts`
- Merge policy:
  - object + object => deep merge
  - primitive + primitive => conflict error
  - object + primitive => conflict error
  - array + any => conflict error unless the team later defines a dedicated array strategy
- Type generation:
  - use `typeof import('...').default`
  - do not parse source AST for object shape extraction
  - use one locale, recommended `zh-CN`, as schema baseline
- JSON generation:
  - support optional aggregated JSON output per locale
  - default target can be `public/locales/<locale>.json`
  - JSON content must follow the same merged namespace tree as runtime messages
- Cross-locale consistency:
  - non-baseline locales must match the baseline namespace structure
  - mismatch should fail generation in strict mode

## File Plan

### Create

- `plugins/i18n/options.ts`
  - plugin option types and defaults
- `plugins/i18n/scan.ts`
  - file discovery and source classification
- `plugins/i18n/namespace.ts`
  - convert file paths into namespace segments
- `plugins/i18n/merge.ts`
  - deep merge and conflict diagnostics
- `plugins/i18n/runtime.ts`
  - generate runtime message module content or virtual module content
- `plugins/i18n/dts.ts`
  - generate `types/i18n.d.ts` content using `typeof import(...).default`
- `plugins/i18n/json.ts`
  - generate aggregated JSON output content and write targets
- `plugins/__tests__/i18n-plugin.spec.ts`
  - plugin behavior tests for scanning, namespace mapping, and merge output
- `plugins/__tests__/i18n-dts.spec.ts`
  - declaration generation tests
- `scripts/gen-i18n-json.ts`
  - optional dedicated JSON generation entry if the team prefers script mode over plugin emission

### Modify

- `plugins/i18n/index.ts`
  - plugin assembly and Vite hook wiring
- `plugins/i18n/README.md`
  - usage, conventions, and conflict examples
- `plugins/index.ts`
  - register the i18n plugin alongside existing plugins
- `src/locales/index.ts`
  - load generated runtime messages into `createI18n`

### Generated Output

- `types/i18n.d.ts`
  - generated declaration file consumed by `tsconfig.app.json`
- `public/locales/<locale>.json`
  - optional generated locale JSON files for runtime consumption or external distribution

## Configuration Proposal

The plugin should support a minimal option surface:

```ts
type I18nPluginOptions = {
  locales: string[]
  defaultLocale: string
  dts?: string | false
  json?:
    | false
    | {
        outDir?: string
        fileName?: (locale: string) => string
      }
  strict?: boolean
  include?: {
    srcLocales?: boolean
    srcPages?: boolean
    appLocales?: boolean
    appPages?: boolean
  }
}
```

Recommended initial defaults:

- `locales: ['zh-CN', 'en-US']`
- `defaultLocale: 'zh-CN'`
- `dts: 'types/i18n.d.ts'`
- `json: false`
- `strict: true`

If JSON export is enabled, recommended defaults:

- `json.outDir: 'public/locales'`
- `json.fileName: locale => \`${locale}.json\``

## Runtime Output Shape

For each locale, the plugin should assemble one final message object:

```ts
{
  workspace: {
    overview: { ... },
  },
  error: { ... },
  admin: {
    workspace: {
      overview: { ... },
    },
    error: { ... },
  },
}
```

`src/locales/index.ts` should consume the generated result as the `messages` option passed to `createI18n`.

## JSON Output Shape

When JSON export is enabled, each locale should be emitted as one file:

- `public/locales/zh-CN.json`
- `public/locales/en-US.json`

Each file should contain the same merged structure as the runtime message object:

```json
{
  "workspace": {
    "overview": {}
  },
  "error": {},
  "admin": {
    "workspace": {
      "overview": {}
    },
    "error": {}
  }
}
```

## JSON Export Strategy

Two valid implementation strategies are acceptable. The plan should keep both available, but implementation should start with one to avoid mixed ownership.

### Option A: Plugin-managed JSON output

- emit JSON during dev/build from the i18n plugin
- output is always derived from the same scan and merge result as runtime messages
- good when the app itself wants a stable public asset

### Option B: Dedicated script

- create a script such as `scripts/gen-i18n-json.ts`
- script reuses `plugins/i18n/scan.ts`, `plugins/i18n/namespace.ts`, and `plugins/i18n/merge.ts`
- good when JSON generation should be explicit and run only in selected workflows

Recommendation for the first implementation:

- keep JSON generation logic reusable in `plugins/i18n/json.ts`
- allow the plugin to call it when `json` is enabled
- optionally expose a script entry later if CI or deployment needs explicit generation

## Type Output Shape

The generated declaration file should build nested types from file imports rather than copying object literals:

```ts
type WorkspaceOverview = typeof import('../src/locales/zh-CN/workspace/overview').default
type ErrorPage = typeof import('../src/pages/error/locales/zh-CN').default
type AdminErrorPage = typeof import('../apps/admin/pages/error/locales/zh-CN').default

interface I18nSchema {
  workspace: {
    overview: WorkspaceOverview
  }
  error: ErrorPage
  admin: {
    error: AdminErrorPage
  }
}
```

The declaration file should augment `vue-i18n` so `t('workspace.overview.xxx')` and `t('admin.error.xxx')` both resolve to the generated schema.

## Task Breakdown

### Task 1: Lock plugin contract and directory rules

**Files:**

- Create: `plugins/i18n/options.ts`
- Modify: `plugins/i18n/README.md`
- Modify: `docs/2026-04-07-i18n-plugin-implementation-plan.md`

- [ ] Define the public plugin options and defaults.
- [ ] Define the optional JSON export contract and output defaults.
- [ ] Document the four source categories: `src/locales`, `src/pages/**/locales`, `apps/<app>/locales`, `apps/<app>/pages/**/locales`.
- [ ] Document the namespace rules for global sources and app-prefixed sources.
- [ ] Document that a trailing `index` segment is collapsed and does not appear in the final key path.
- [ ] Document that route-style dynamic segments are normalized to `$segment` in the final key path.
- [ ] Document that `pages/**/locales` only reads `<locale>.ts` and rejects extra files.
- [ ] Document the merge policy and conflict rules with concrete examples.
- [ ] Document the two JSON export modes: plugin-managed and script-managed.

### Task 2: Implement source scanning and source descriptors

**Files:**

- Create: `plugins/i18n/scan.ts`
- Create: `plugins/i18n/namespace.ts`
- Modify: `plugins/i18n/index.ts`
- Test: `plugins/__tests__/i18n-plugin.spec.ts`

- [ ] Write tests for source discovery using temporary fixture directories.
- [ ] Scan `src/locales/<locale>/**/*.ts`, excluding `index.ts`.
- [ ] Scan `src/pages/**/locales/<locale>.ts`.
- [ ] Scan `apps/<app>/locales/<locale>/**/*.ts`.
- [ ] Scan `apps/<app>/pages/**/locales/<locale>.ts`.
- [ ] Return a normalized descriptor per file:
  - absolute path
  - relative import path
  - locale
  - source kind
  - app name when present
  - namespace segments
- [ ] Collapse a trailing `index` segment from namespace segments before merge and type generation.
- [ ] Normalize dynamic segments before merge and type generation:
  - `[id]` -> `$id`
  - `[slug]` -> `$slug`
  - `[...all]` -> `$all`
  - `[[id]]` -> `$id`
- [ ] Reject invalid page locale layouts such as `src/pages/error/locales/common.ts`.
- [ ] Run targeted tests:

```bash
vp test --run --config vitest.config.ts plugins/__tests__/i18n-plugin.spec.ts
```

Expected: source classification and namespace mapping cases pass.

### Task 3: Implement deep merge and conflict diagnostics

**Files:**

- Create: `plugins/i18n/merge.ts`
- Modify: `plugins/i18n/index.ts`
- Test: `plugins/__tests__/i18n-plugin.spec.ts`

- [ ] Write tests for object-object merge.
- [ ] Write tests for primitive collisions.
- [ ] Write tests for object-primitive collisions.
- [ ] Write tests for array collisions.
- [ ] Implement a merge function that deep merges only plain objects.
- [ ] Include both conflicting source file paths in the error message.
- [ ] Keep merge deterministic regardless of scan order.
- [ ] Re-run:

```bash
vp test --run --config vitest.config.ts plugins/__tests__/i18n-plugin.spec.ts
```

Expected: merge success and conflict cases behave exactly as documented.

### Task 4: Generate runtime messages for `createI18n`

**Files:**

- Create: `plugins/i18n/runtime.ts`
- Modify: `plugins/i18n/index.ts`
- Modify: `src/locales/index.ts`
- Test: `plugins/__tests__/i18n-plugin.spec.ts`

- [ ] Choose one runtime delivery strategy:
  - virtual module such as `virtual:i18n-messages`, or
  - generated module file under the plugin directory
- [ ] Generate locale-specific import statements for every discovered source file.
- [ ] Build one final `messages` object keyed by locale.
- [ ] Keep the output tree identical to the namespace mapping rules.
- [ ] Update `src/locales/index.ts` so `createI18n` consumes the generated `messages`.
- [ ] Verify that the app still initializes with an empty or partial locale set during development.
- [ ] Run:

```bash
vp check
```

Expected: app types remain valid after `src/locales/index.ts` is wired to generated messages.

### Task 5: Generate optional aggregated JSON output

**Files:**

- Create: `plugins/i18n/json.ts`
- Optionally create: `scripts/gen-i18n-json.ts`
- Modify: `plugins/i18n/index.ts`
- Test: `plugins/__tests__/i18n-plugin.spec.ts`

- [ ] Write tests for JSON output shape using merged source fixtures.
- [ ] Serialize one JSON file per locale from the same merged tree used by runtime messages.
- [ ] Support `public/locales/<locale>.json` as the default output target when JSON export is enabled.
- [ ] Ensure JSON output is stable and deterministic.
- [ ] If script mode is implemented, make it reuse the same scan and merge utilities instead of duplicating logic.
- [ ] Add one package script if script mode is chosen, for example:

```bash
pnpm gen:i18n-json
```

- [ ] Run:

```bash
vp test --run --config vitest.config.ts plugins/__tests__/i18n-plugin.spec.ts
```

Expected: generated JSON matches the merged locale tree and lands in the configured public directory.

### Task 6: Generate `types/i18n.d.ts` with `typeof import(...).default`

**Files:**

- Create: `plugins/i18n/dts.ts`
- Modify: `plugins/i18n/index.ts`
- Test: `plugins/__tests__/i18n-dts.spec.ts`

- [ ] Write tests that snapshot generated declaration output.
- [ ] Use the baseline locale, recommended `zh-CN`, to build the schema tree.
- [ ] Generate type aliases from source files with `typeof import('...').default`.
- [ ] Rebuild the nested namespace type tree from namespace segments.
- [ ] Augment `vue-i18n` with the final schema interface.
- [ ] Write the generated file to `types/i18n.d.ts` when `dts` is enabled.
- [ ] Keep generated imports relative to the declaration file location.
- [ ] Run:

```bash
vp test --run --config vitest.config.ts plugins/__tests__/i18n-dts.spec.ts
vp check
```

Expected: declaration output is stable and recognized by TypeScript.

### Task 7: Add cross-locale consistency checks

**Files:**

- Modify: `plugins/i18n/dts.ts`
- Modify: `plugins/i18n/index.ts`
- Test: `plugins/__tests__/i18n-dts.spec.ts`

- [ ] Compare all non-baseline locale descriptors against the baseline namespace tree.
- [ ] Fail generation in `strict: true` mode when a namespace path is missing or structurally different.
- [ ] Add a clear error message that includes:
  - locale
  - namespace path
  - expected source path
  - actual source path if present
- [ ] Keep a future escape hatch for warning-only mode if the team later needs it.
- [ ] Re-run:

```bash
vp test --run --config vitest.config.ts plugins/__tests__/i18n-dts.spec.ts
```

Expected: mismatched locale trees fail with actionable diagnostics.

### Task 8: Register plugin and document usage

**Files:**

- Modify: `plugins/index.ts`
- Modify: `plugins/i18n/README.md`
- Modify: `src/locales/index.ts`
- Optionally modify: `package.json`

- [ ] Register the i18n plugin in `loadPlugins`.
- [ ] Set `dts: 'types/i18n.d.ts'` in the initial integration.
- [ ] Decide whether the first rollout enables JSON output by default or leaves it opt-in.
- [ ] If script mode is implemented, add the script entry in `package.json`.
- [ ] Add README examples for:
  - global locale file
  - page locale file
  - app locale file
  - app page locale file
  - merge success example
  - conflict example
- [ ] Add README examples for JSON output paths and when to use plugin mode vs script mode.
- [ ] Document generated output expectations and common error messages.
- [ ] Run:

```bash
vp check
```

Expected: plugin integration compiles cleanly and the docs match actual behavior.

## Verification Checklist

- `types/i18n.d.ts` is generated and picked up by TypeScript without extra tsconfig changes
- `src/locales/index.ts` initializes `vue-i18n` with collected messages
- optional JSON export writes one merged file per locale into `public/locales`
- `src` and `apps/*` both produce the expected namespace tree
- dynamic route directories such as `[id]` produce stable key paths such as `$id`
- global and page locale objects deep merge without silent replacement
- leaf-key collisions fail loudly with source-aware diagnostics
- page locale directories only accept `<locale>.ts`
- `t()` receives key completion for root keys and `admin.*` keys

## Risks

- Merge semantics can become ambiguous if locale authors start exporting arrays or wide index signatures.
- Relative import path generation for `types/i18n.d.ts` must stay correct on both Unix and Windows path separators.
- If locale files start exporting dynamic objects, `typeof import(...).default` will still work but inferred key precision may degrade.

## Non-Goals

- No automatic translation fallback generation between locales
- No runtime lazy loading by route in the first iteration
- No AST-based literal analysis for locale values
- No rewrite of existing locale files beyond what is required to satisfy the documented conventions

## Suggested Implementation Order

1. Finish Task 1 and Task 2 so source classification is stable.
2. Finish Task 3 so merge behavior is deterministic before wiring runtime output.
3. Finish Task 4 so the app can consume generated messages.
4. Finish Task 5 if JSON output is needed in the first iteration.
5. Finish Task 6 and Task 7 so type generation and consistency checks are reliable.
6. Finish Task 8 and do one full `vp check` pass.
