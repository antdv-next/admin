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

## Injection Pattern

- Fetch user info and menus concurrently before protected route injection.
- Rebuild dynamic routes when auth state or menu permissions change.
- Inject public routes for unauthenticated state, and filtered routes for authenticated state.
- Login page should explicitly set `access.mode = 'public'`.

## Current Helpers

- `src/router/guard-menu.ts`
  - `filterRoutesByAccess(routes, menus, isAuthenticated)`
  - `filterRoutesByMenuAccess(routes, menus)`
- `src/router/guard/auth.ts`
  - sync token
  - ensure auth context
  - rebuild accessible routes
  - continue navigation
