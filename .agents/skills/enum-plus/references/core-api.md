# enum-plus Core API

## Initializer Forms

### Key-value form

Use for lightweight constant replacement.

```ts
import { Enum } from 'enum-plus';

const WeekEnum = Enum({
  Sunday: 0,
  Monday: 1,
} as const);
```

### Standard form

Prefer this for most app code.

```ts
const WeekEnum = Enum({
  Sunday: { value: 0, label: 'week.sunday' },
  Monday: { value: 1, label: 'week.monday' },
});
```

### Key-label form

Use when `value === key`.

```ts
const WeekEnum = Enum({
  Sunday: { label: 'week.sunday' },
  Monday: { label: 'week.monday' },
});
```

### Array form

Use for API data or dynamic lists.

```ts
const PetEnum = Enum(data, {
  getValue: 'id',
  getLabel: 'name',
  getKey: 'code',
});
```

`getValue`, `getLabel`, and `getKey` can also be functions.

### Native enum form

Use for incremental migration.

```ts
enum WeekNative {
  Sunday = 0,
  Monday,
}

const WeekEnum = Enum(WeekNative);
```

## Instance Properties

- `named`: item lookup by enum key.
- `items`: readonly item array for iteration and UI binding.
- `values`: array of enum values.
- `labels`: array of item labels.
- `keys`: array of item keys.
- `meta`: grouped arrays of custom metadata fields.
- `name`: enum collection display name.

## Instance Methods

- `has(keyOrValue)`: guard unknown input.
- `findBy(field, value)`: find by `key`, `value`, `label`, or metadata field.
- `label(keyOrValue)`: turn value or key into label text.
- `key(value)`: reverse-map a value to its key.
- `raw()`: return the full initializer object.
- `raw(keyOrValue)`: return the matching raw item.
- `toList(options)`: map to option arrays.
- `toMap(options)`: map to object lookups.

Prefer these methods over duplicate maps and `switch` blocks.

## TypeScript-only Helpers

- `typeof MyEnum.valueType`: union of all enum values.
- `typeof MyEnum.keyType`: union of all enum keys.
- `typeof MyEnum.rawType`: initializer object type.

For TypeScript below 5.0, use `as const` on initializer objects to avoid widening values to `string` or `number`.

## Static API

- `Enum.isEnum(obj)`: check whether an object came from `Enum(...)`.
- `Enum.localize = fn`: configure global label and name localization.
- `Enum.extends(obj)`: add methods to all enum instances.
- `Enum.install(plugin, options?)`: install reusable plugin behavior.

## Global Config

`Enum.config.autoLabel` controls label generation.

- `true`: derive labels from `labelPrefix` plus item key or label.
- `false`: require explicit labels.
- `function`: customize label generation.

Per-enum `options.autoLabel` overrides the global setting.

## Fast Patterns

### Use enum metadata instead of parallel tables

```ts
const StatusEnum = Enum({
  Draft: { value: 0, label: 'Draft', color: 'default' },
  Published: { value: 1, label: 'Published', color: 'success' },
});

StatusEnum.named.Published.raw.color;
StatusEnum.meta.color;
```

### Use enum guards for external data

```ts
function normalizeStatus(value: unknown) {
  if (!StatusEnum.has(value as string | number))
    return StatusEnum.Draft;

  return value as typeof StatusEnum.valueType;
}
```

### Use enum output transforms only when the consumer shape differs

```ts
StatusEnum.toList({ valueField: 'id', labelField: 'name' });
StatusEnum.toMap({ keySelector: 'key', valueSelector: 'value' });
```
