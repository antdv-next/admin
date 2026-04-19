# Dictionary Usage

Use `useDict()` for both global dictionaries and page-level dictionaries. Do not call dictionary APIs directly in page code unless you are extending the shared dictionary capability itself.

## Data Sources

- Global dictionaries are loaded from `'/dict/list'`.
- Page-level dictionaries are loaded from `'/dist/code/list'`.
- Both APIs return flat arrays; `useDict()` converts them to trees internally.
- Global dictionaries are preloaded in the auth guard together with auth context and do not block navigation if loading fails.

## Basic Usage

Only use global dictionaries:

```ts
const { getLabel, getOptions } = useDict()

const label = getLabel('global_status', '1')
const options = getOptions('global_status')
```

Use page-level dictionaries and keep code hints:

```ts
const { getItem, getLabel, getOptions } = useDict([
  'user_status',
  'order_status',
] as const)

const statusLabel = getLabel('user_status', '1')
const statusItem = getItem('user_status', '1')
const statusOptions = getOptions('user_status')
```

You can also keep the composable as a whole:

```ts
const dict = useDict(['user_status'] as const)

await dict.loadDict('user_status')
const item = dict.getItem('user_status', '1')
```

## Type Hints

- `useDict(['code1', 'code2'] as const)` gives literal `code` hints to `getDict()`, `getItem()`, `getLabel()`, and `getOptions()`.
- Destructuring keeps those hints:

```ts
const { getOptions } = useDict(['user_status'] as const)
```

- The helper methods still accept any `string`, so global dictionaries and dynamic codes are not blocked by types.
- Add stable global dictionary codes in [types/dict.d.ts](/Users/yanyu/workspace/gitea/antdv-next/admin/types/dict.d.ts:1) to improve hints for shared/global codes.

Example:

```ts
interface DictCodeRegistry {
  global_status: true
  tenant_type: true
}
```

## What `useDict()` Returns

- `getDict(code)`: get the tree for one dictionary code.
- `getItem(code, value)`: find one item in the tree by `value`.
- `getLabel(code, value)`: shortcut for item label, returns `''` when missing.
- `getOptions(code, fieldMap?)`: map tree nodes to option data for select-like components.
- `loadDict(code | code[])`: manually load one or more page-level dictionaries.
- `loadGlobalDict()`: manually reload global dictionaries.
- `isDictLoaded(code)` / `isDictLoading(code)`: inspect page-level loading state.

## `getOptions()` Mapping

`getOptions()` returns standard option fields by default:

```ts
const options = getOptions('user_status')
```

Returned fields:

- `label`
- `value`
- `key`
- `title`
- `children`
- `disabled`

If the target component expects different field names, pass a field map:

```ts
const options = getOptions('user_status', {
  label: 'name',
  value: 'id',
  children: 'nodes',
})
```

## `expand` Merge

Dictionary items may carry `expand` as a JSON string. `useDict()` does not merge it by default.

Enable merge only when the page needs those extra fields:

```ts
const item = getItem('user_status', '1', { mergeExpand: true })

const options = getOptions(
  'user_status',
  undefined,
  { mergeExpand: true },
)
```

Rules:

- Default is `mergeExpand: false`.
- Only valid JSON objects are merged.
- Invalid JSON or non-object JSON is ignored.
- Core fields are protected and are not overwritten by `expand`.

## Loading Behavior

- `useDict(['code1', 'code2'] as const)` auto-loads those page-level dictionaries.
- Repeated requests for the same code set are deduplicated.
- Loaded page dictionaries are cached by single `code`.
- `useDict()` without args only reads global dictionary cache.
- Manual `loadDict()` is still available when you need controlled loading timing.

## Recommendation

- Use global dictionaries for stable shared data.
- Pass page-specific codes directly into `useDict([...])` in the page or shared component that consumes them.
- Prefer `as const` for static page codes so editor hints stay useful.
- Use `getOptions()` for UI options instead of remapping dictionary trees repeatedly in page code.
