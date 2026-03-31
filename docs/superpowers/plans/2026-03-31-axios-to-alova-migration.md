# Axios to Alova Migration Plan

## Goal

Replace the current Axios-based request layer with alova, remove Axios completely, and migrate mock support to `@alova/mock` on top of `alova/fetch`.

## Current State

### Runtime request stack

- Shared Axios instance: `src/utils/request/instance.ts`
- Request wrapper helpers and `tryIt`: `src/utils/request/index.ts`
- Request metadata typing: `src/utils/request/interface.ts`
- Token injection: `src/utils/request/guard/request.ts`
- Response unwrap and error toast: `src/utils/request/guard/response.ts`
- Local mock interceptor: `src/utils/request/guard/mock.ts`

### Business API modules

- Login: `src/api/auth/login.ts`
- User info and menus: `src/api/user/index.ts`
- Demo/test endpoints: `src/api/test/index.ts`

### Real consumers

- Login submit flow: `src/pages/login/index.vue`
- User store loading and request dedupe: `src/stores/user.ts`
- Request demo page: `src/pages/request/index.vue`

### Mock system

- Mock DSL and types: `mock/index.ts`
- Runtime mock routes:
  - `mock/login/index.ts`
  - `mock/user/info.ts`
  - `mock/user/menus.ts`
  - `mock/test/index.ts`
  - `mock/dev/btns.ts`
- Mock-related source test: `src/utils/request/__tests__/mock-guard-source.spec.ts`
- Mock data test: `mock/user/__tests__/menus.spec.ts`

### Existing constraints that affect migration cost

- `src/utils/request/index.ts` is auto-imported by Vite plugin config in `plugins/index.ts` and `vitest.config.ts`.
- Existing API functions return `Promise` values, not alova `Method` instances.
- Existing pages/stores use imperative `await` calls plus `tryIt`, not `alova/client` hooks.
- Mock is currently implemented as an Axios request interceptor, not as a request adapter.
- `.env.production` currently sets `VITE_APP_MOCK_ENABLED=true`; this must be reviewed before migrating mock behavior.

## Recommended Strategy

Use a direct migration to `alova + alova/fetch + @alova/mock`.

This is the right route when the team already knows it does not want Axios compatibility. The migration is still best executed in slices, but there is no need to introduce `@alova/adapter-axios` as a bridge.

## Cost Estimate

### Direct migration: remove axios and use fetch adapter

- Estimated effort: 2 to 4 engineer-days
- Risk: medium
- Expected touched files: 15 to 22
- Main work:
  - create alova instance with `alova/fetch`
  - move request/response interceptors into alova hooks
  - replace custom mock interceptor with `@alova/mock`
  - remove Axios-specific config, types, and error assumptions
  - adapt API modules to alova method style
  - keep imperative consumers stable first, then adopt hooks selectively

### Biggest hidden cost drivers

- Naming collision and mental model mismatch:
  - Current project already exports `useRequest/useGet/usePost/...` from `src/utils/request/index.ts`, but they are promise helpers, not alova hooks.
- Contract change in API layer:
  - alova works best when API functions return `Method` instances, while current code expects already-sent requests.
- Transport semantics change:
  - `fetch` and Axios differ on request config shape, timeout handling, cancellation, header access, and error objects.
- Auto-import configuration:
  - request helpers are auto-imported, so export surface changes can ripple across build and test tooling.
- Mock migration:
  - current mock matching is file-path driven and Axios-response aware; `@alova/mock` uses adapter-based interception and defaults to fetch-style `Response`.

## File Plan

### Create

- `src/utils/request/alova.ts`
  - alova instance, adapter selection, global hooks
- `src/utils/request/alova-mock.ts`
  - `@alova/mock` adapter setup and mock registration
- `src/utils/request/method.ts`
  - shared helpers for building method instances if needed
- `src/utils/request/__tests__/alova-setup.spec.ts`
  - verify token injection, response unwrap, and error handling
- `src/utils/request/__tests__/alova-mock.spec.ts`
  - verify mock registration and runtime behavior

### Modify

- `package.json`
  - add `alova`, `@alova/mock`
  - remove `axios`
- `plugins/index.ts`
  - update auto-import source if request entrypoint changes
- `vitest.config.ts`
  - keep tests aligned with the new request entrypoint
- `src/utils/request/index.ts`
  - become compatibility facade or re-export layer
- `src/utils/request/interface.ts`
  - remove Axios-only types and define project-specific request meta
- `src/api/auth/login.ts`
- `src/api/user/index.ts`
- `src/api/test/index.ts`
- `src/stores/user.ts`
- `src/pages/login/index.vue`
- `src/pages/request/index.vue`
- `mock/index.ts`
- `mock/login/index.ts`
- `mock/user/info.ts`
- `mock/user/menus.ts`
- `mock/test/index.ts`
- `mock/dev/btns.ts`
- `src/utils/request/__tests__/mock-guard-source.spec.ts`

### Delete at end of migration

- `src/utils/request/instance.ts`
- `src/utils/request/guard/request.ts`
- `src/utils/request/guard/response.ts`
- `src/utils/request/guard/mock.ts`

## Migration Tasks

### Task 1: Lock direct migration target and compatibility mode

**Files:**

- Modify: `package.json`
- Modify: `docs/superpowers/plans/2026-03-31-axios-to-alova-migration.md`

- [ ] Confirm that API modules will return alova `Method` instances immediately, while `src/utils/request/index.ts` temporarily preserves compatibility helpers for consumers.
- [ ] Confirm production mock policy because `.env.production` currently enables mock.

### Task 2: Introduce alova instance with fetch adapter

**Files:**

- Create: `src/utils/request/alova.ts`
- Modify: `src/utils/request/interface.ts`

- [ ] Install dependencies:

```bash
pnpm add alova @alova/mock
pnpm remove axios
```

- [ ] Create `createAlova` setup using `adapterFetch()`.
- [ ] Move `baseURL` and `timeout` setup into alova instance config.
- [ ] Define a project-local `RequestMeta` type that no longer depends on Axios internal config types.
- [ ] Port token injection into `beforeRequest`.
- [ ] Port response unwrapping and error toast into `responded.onSuccess` and `responded.onError`.
- [ ] Normalize timeout and thrown-error behavior so callers do not depend on Axios error shape.

### Task 3: Migrate mock infrastructure to `@alova/mock`

**Files:**

- Create: `src/utils/request/alova-mock.ts`
- Modify: `mock/index.ts`
- Modify: `mock/login/index.ts`
- Modify: `mock/user/info.ts`
- Modify: `mock/user/menus.ts`
- Modify: `mock/test/index.ts`
- Modify: `mock/dev/btns.ts`
- Modify: `src/utils/request/__tests__/mock-guard-source.spec.ts`

- [ ] Replace interceptor-based mock wiring with adapter-based mock wiring.
- [ ] Use `createAlovaMockAdapter`.
- [ ] Use `adapterFetch()` as the fallback `httpAdapter`.
- [ ] Keep unmatched requests falling through to the real adapter.
- [ ] Preserve current behavior:
  - route matching by method + path
  - custom status and delay
  - access to query, params, body, headers
- [ ] Prefer `matchMode: 'methodurl'` so mock definitions do not need to repeat `baseURL` path fragments.
- [ ] Keep production builds excluding mock code behind environment-based adapter selection.
- [ ] Rewrite tests so they verify alova mock registration instead of source-string checks against Axios interceptor code.

### Task 4: Build a compatibility facade

**Files:**

- Modify: `src/utils/request/index.ts`
- Modify: `plugins/index.ts`
- Modify: `vitest.config.ts`

- [ ] Keep `src/utils/request/index.ts` as the single auto-import entrypoint.
- [ ] Export only one public model for this project:
  - either promise-style helpers for temporary compatibility
  - or alova-native method builders plus selected hooks
- [ ] Avoid naming confusion between local helpers and `alova/client` `useRequest`.
- [ ] Recommended short-term approach:
  - export `requestGet/requestPost/requestPut/requestDelete/requestPatch`
  - export `useAlovaRequest` as a project alias to `alova/client`
  - keep `tryIt` until all consumers are converted

### Task 5: Convert API modules to alova-native definitions

**Files:**

- Modify: `src/api/auth/login.ts`
- Modify: `src/api/user/index.ts`
- Modify: `src/api/test/index.ts`

- [ ] Change each API module to return alova `Method` instances.
- [ ] Keep response typing on the method factory itself.
- [ ] Keep request metadata like `token: false` and `mock` in a project-local config shape.
- [ ] Do not send requests inside API module factories unless compatibility mode explicitly requires it.

Example target shape:

```ts
export const loginApi = (params: LoginParams) =>
  alovaInst.Post<R<LoginResponse>>('/login', params, {
    meta: { token: false },
  })
```

### Task 6: Update imperative consumers first

**Files:**

- Modify: `src/pages/login/index.vue`
- Modify: `src/stores/user.ts`
- Modify: `src/pages/request/index.vue`
- Modify: `src/stores/__tests__/user.spec.ts`

- [ ] Update login page to call alova method send path in the least disruptive way.
- [ ] Update user store to preserve concurrent request dedupe behavior.
- [ ] Keep `tryIt` or an equivalent helper until all imperative consumers are stable.
- [ ] Update request demo page to either:
  - stay imperative for parity testing, or
  - become the first alova hook demo page.
- [ ] Update unit tests to mock method factories or sent requests according to the new contract.
- [ ] Replace Axios-specific error typing in callers that currently assume `ER` comes from `AxiosError.response.data`.

### Task 7: Introduce alova hooks where they add value

**Files:**

- Modify: `src/pages/request/index.vue`
- Optionally modify: `src/pages/login/index.vue`
- Optionally create: `src/composables/request/*.ts`

- [ ] Add `alova/vue` `statesHook` in the alova instance.
- [ ] Introduce `alova/client` hooks only in component-facing code.
- [ ] Do not move Pinia store logic to hooks unless there is clear value.
- [ ] Good first candidates:
  - request demo page
  - future list/detail pages with loading/error/data state

### Task 8: Verify direct migration and release

**Files:**

- Test: `src/utils/request/__tests__/alova-setup.spec.ts`
- Test: `src/utils/request/__tests__/alova-mock.spec.ts`
- Test: `src/stores/__tests__/user.spec.ts`
- Test: `mock/user/__tests__/menus.spec.ts`

- [ ] Run:

```bash
pnpm exec vitest run src/utils/request/__tests__/alova-setup.spec.ts src/utils/request/__tests__/alova-mock.spec.ts src/stores/__tests__/user.spec.ts mock/user/__tests__/menus.spec.ts
```

- [ ] Run:

```bash
pnpm build
```

- [ ] Validate manually:
  - login success and failure
  - token injection still works
  - user info and menu loading still dedupe
  - mock enabled and disabled modes both behave correctly

## Rollback Strategy

- Keep `src/utils/request/index.ts` as the only public entrypoint during migration.
- Land the alova fetch path behind the same public entrypoint before deleting old files.
- Delete old Axios-only files only after build, tests, and manual auth flow checks pass.

## Recommendation

For this repo, a direct removal of Axios is reasonable.

Reason:

- The business request surface is still small.
- Existing behavior maps cleanly onto alova hooks/interceptors plus fetch adapter.
- The main migration risk is not endpoint count, but API contract, fetch error shape, and mock contract changes.
- Keeping `src/utils/request/index.ts` as the only public facade contains the blast radius while still removing Axios in one pass.
