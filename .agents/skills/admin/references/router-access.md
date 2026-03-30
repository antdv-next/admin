# Router Access

## Access Meta

Route access is configured on `meta.access`.

```ts
access?: {
  mode?: 'public' | 'login' | 'menu' | 'inherit'
  from?: string
}
```

## Default Behavior

- Missing `access.mode` means `menu`.
- `public` means no login and no permission required.
- `login` means login required, but no menu permission required.
- `menu` means the route must be present in the backend menu permission list.
- `inherit` means reuse the permission rule from `access.from`.

## Backend Menu Assumption

- Backend menus are treated as a flat list.
- Permission matching uses the normalized `routePath` set only.
- Do not recurse the menu structure on the frontend.

## Frontend Route Filtering

- Route filtering still recurses the route tree, because parent routes may need to stay when accessible children remain.
- `inherit` should reuse the target route's permission path, not the inheriting route's own path.
- Public routes stay injected even when unauthenticated.
- `login` routes are injected only after login.

## Shared Shell Access Pattern

For a shared parent shell like `/admin/user/**`, set access like this:

- parent shell route: `meta.access.mode = 'login'`
- default child route: `meta.access.mode = 'inherit'`, `from = '/admin/user'`
- named child routes like `/admin/user/center`: `meta.access.mode = 'inherit'`, `from = '/admin/user'`

Example:

```ts
// apps/admin/pages/user.vue
definePage({
  meta: {
    access: {
      mode: 'login',
    },
  },
})
```

```ts
// apps/admin/pages/user/center.vue
definePage({
  meta: {
    access: {
      mode: 'inherit',
      from: '/admin/user',
    },
  },
})
```

Use this pattern when the whole section only requires login and should not depend on backend menu
permissions for each child page.

## Injection Pattern

- Fetch user info and menus concurrently before protected route injection.
- Rebuild dynamic routes when auth state or menu permissions change.
- Inject public routes for unauthenticated state, and filtered routes for authenticated state.
- Login page should explicitly set `access.mode = 'public'`.

## Default Entry Redirects

- Default entry paths are configured in `src/constants/router.ts`.
- `UNAUTH_DEFAULT_PATH` is the unauthenticated landing path. Current default: `/home`.
- `AUTH_DEFAULT_PATH` is the authenticated landing path. Current default: `/admin`.
- Root route `/` should resolve dynamically by auth state instead of hardcoding a single redirect target.
- Unauthenticated users hitting protected routes should redirect to `UNAUTH_DEFAULT_PATH`.
- Authenticated users hitting `/login` should redirect to `AUTH_DEFAULT_PATH`.
- Login success should also redirect to `AUTH_DEFAULT_PATH`.
- If `UNAUTH_DEFAULT_PATH` points at a page, that page must be marked `meta.access.mode = 'public'`.

## Current Helpers

- `src/router/guard-menu.ts`
  - `filterRoutesByAccess(routes, menus, isAuthenticated)`
  - `filterRoutesByMenuAccess(routes, menus)`
- `src/constants/router.ts`
  - `LOGIN_PATH`
  - `UNAUTH_DEFAULT_PATH`
  - `AUTH_DEFAULT_PATH`
- `src/router/redirect.ts`
  - `getDefaultEntryPath(isAuthenticated)`
  - `resolveAuthGuardRedirect({ isAuthenticated, isPublicRoute, toPath })`
- `src/router/static-router.ts`
  - root route redirect delegates to `getDefaultEntryPath`
- `src/router/guard/auth.ts`
  - sync token
  - ensure auth context
  - rebuild accessible routes
  - apply auth-based redirect decisions
  - continue navigation
