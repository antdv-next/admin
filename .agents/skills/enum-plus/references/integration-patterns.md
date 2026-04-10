# enum-plus Integration Patterns

## UI Binding

### Prefer `items` for direct option rendering

`items` is the default bridge to most UI component libraries.

```vue
<a-select :options="WeekEnum.items" />
```

```tsx
<Select options={WeekEnum.items} />
```

Use `toList(...)` only when field names must change.

## Ant Design and Related Plugins

Core enum-plus does not ship React Ant Design helpers like `toSelect`, `toMenu`, `toFilter`, or `toValueMap`.

Install `@enum-plus/plugin-antd` before using those methods.

```ts
import antdPlugin from '@enum-plus/plugin-antd';
import { Enum } from 'enum-plus';

Enum.install(antdPlugin);
```

For Vue stacks such as Ant Design Vue or `antdv-next`, `enum.items` is usually enough because component APIs already accept option arrays.

## Localization

### Prefer existing plugins when available

Use the stack-specific plugin when the project already uses that i18n system:

- `@enum-plus/plugin-i18next`
- `@enum-plus/plugin-react-i18next`
- `@enum-plus/plugin-i18next-vue`
- `@enum-plus/plugin-vue-i18n`
- `@enum-plus/plugin-next-international`

### Fall back to `Enum.localize`

```ts
Enum.localize = (key) => i18n.t(key);
```

### Custom label logic

Use a function label when one enum needs specialized behavior.

```ts
const WeekEnum = Enum({
  Sunday: { value: 0, label: () => 'Sunday' },
});
```

## Extensions and Plugins

Use `Enum.extends` for project-level methods shared by all enums.

```ts
Enum.extends({
  toMySelect() {
    return this.items.map((item) => ({
      value: item.value,
      title: item.label,
    }));
  },
});
```

In TypeScript, also extend `enum-plus/extension` so the new methods are typed.

Use `Enum.install` when packaging the behavior as a reusable plugin with optional configuration.

## Naming Conflicts

Enum item names can shadow built-in enum properties like `keys`, `values`, `items`, or `toList`.

If that happens, use enum-plus symbol aliases such as `ITEMS`, `KEYS`, and `VALUES` to reach the built-in behavior instead of renaming runtime APIs blindly.

## Best Practices

- Prefer one enum per cohesive domain.
- Keep enum names and member names semantic and stable.
- Put labels and metadata on the enum, not in separate lookup modules.
- Add JSDoc on enum members when the codebase benefits from hover help.
- Start localization early if the enum will surface in UI.
- Use `Enum(NativeEnum)` or `Enum(existingRaw)` for gradual migration instead of rewriting every consumer at once.

## Common Pitfalls

- Mixing standard form and key-value form inside one enum.
- Expecting `label` to localize without configuring `Enum.localize` or a plugin.
- Assuming plugin APIs are available before installation.
- Mutating `items` or item objects directly.
- Replacing precise unions with broad `string` or `number` types when `valueType` or `keyType` is available.
