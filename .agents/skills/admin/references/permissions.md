# Permissions

Use this reference for button-level permission codes, generated permission types, the
`<Access>` component, and the `useAccess()` composable.

## Scope Boundary

- Route access control lives in `references/router-access.md`.
- This file covers button and action permissions after the route is already accessible.

## Runtime Source

- Current-user permissions come from `/user/menus`.
- The backend menu list is still treated as a flat array.
- Button permissions are extracted from items where `menuType === 'menu_type_btn'`.
- Permission code resolution uses `permission ?? code`.
- Runtime extraction currently happens in `src/stores/user.ts` through
  `extractMenuPermissions()` from `src/utils/permission.ts`.

## User Store Contract

`useUserStore()` exposes:

- `menus: MenuInfo[]`
- `permissions: string[]`

Behavior:

- `fetchMenus()` stores the raw menu list in `menus`.
- `fetchMenus()` also derives `permissions` from button items in the same response.
- Token reset, logout, and menu fetch failure should clear `permissions`.
- `ensureAuthContext()` returns `permissions` together with `userInfo` and `menus`.

## Generated Permission Types

Permission type generation is development-only.

- Command: `vp run gen:perType`
- Script entry: `scripts/gen-per-type.ts`
- Output file: `types/permission.d.ts`
- Runtime: `esno`

Generation flow:

1. Try `PERMISSION_API_URL` if provided.
2. Otherwise request the local default `/dev/btns` endpoint.
3. If that is unavailable in local generation, fall back to `mock/dev/btns.ts`.
4. Extract unique permission codes and emit a global type file.

Generated types:

- `KnownPerCodeType`
- `PerCodeType`

`PerCodeType` must keep a string fallback:

```ts
type PerCodeType = KnownPerCodeType | (string & {})
```

This preserves editor completion for known codes without blocking custom or not-yet-generated
strings.

## Consumption APIs

### `<Access>`

- Global component registered in `src/main.ts`
- Component file: `src/components/access/access.vue`
- Props:
  - `auth: PerCodeType | readonly PerCodeType[]`
  - `mode?: 'all' | 'any'`
- Default mode is `all`

Example:

```vue
<Access auth="system:user:create">
  <AButton>Create User</AButton>
</Access>

<Access :auth="['system:user:create', 'system:user:update']" mode="any">
  <AButton>Batch Action</AButton>
</Access>
```

### `useAccess()`

- Composable file: `src/composables/access.ts`
- Returns:
  - `permissions`
  - `hasAccess`
  - `hasAnyAccess`
  - `hasAllAccess`

Example:

```ts
const { hasAccess, hasAnyAccess } = useAccess()

const canCreate = computed(() => hasAccess('system:user:create'))
const canOperate = computed(() =>
  hasAnyAccess(['system:user:create', 'system:user:update']),
)
```

## Implementation Rules

- Do not fetch a separate runtime permission endpoint just for `useAccess()`.
- Keep runtime permission derivation based on `/user/menus` button items.
- Keep type generation separate from runtime permission loading.
- Do not make production startup depend on `gen:perType`.
- Do not hand-edit `types/permission.d.ts`.

## When To Update This Area

Read this file before changing any of the following:

- `src/components/access/access.vue`
- `src/composables/access.ts`
- `src/utils/permission.ts`
- `src/stores/user.ts` permission extraction behavior
- `scripts/gen-per-type.ts`
- `types/permission.d.ts`
