---
name: enum-plus
description: Use when defining, migrating, validating, localizing, or rendering enum-plus enums in TypeScript or JavaScript code, including replacing native enums, adding labels or metadata, generating UI option data, installing enum-plus plugins, or narrowing values with enum-derived types.
---

# Enum Plus

## Overview

Use `Enum(...)` when plain constants or native `enum` are not enough and the task needs labels, metadata, option lists, reverse lookup, or enum-aware typing. Prefer the standard object form in application code because it keeps UI text, metadata, and lookups in one place.

## Workflow

1. Pick one enum shape and keep it consistent for the whole enum.
2. Prefer the standard `{ value, label, ...meta }` form unless the task is intentionally simpler.
3. Use built-in enum methods before writing custom maps or switch statements.
4. Read the matching reference file for deeper details.

## Choose the Input Form

- Use key-value form for lightweight constant replacement.
- Use standard form for most app code, especially if the enum feeds UI or needs metadata.
- Use key-label form when `value` should equal `key`.
- Use array form when the source data is dynamic or comes from an API.
- Use native-enum conversion only when the project already owns a native `enum` and wants enum-plus behavior on top.

Read [`references/core-api.md`](./references/core-api.md) for examples of each form.

## Apply the Core Rules

- Do not mix initialization shapes inside one enum.
- Keep enum type names in `PascalCase` with an `Enum` suffix.
- Prefer enum member keys in `PascalCase`.
- Use `has`, `label`, `key`, `findBy`, `toList`, and `toMap` before writing custom helpers.
- Store UI-adjacent metadata on enum items instead of scattering extra lookup tables.
- Validate untrusted values with `enum.has(value)` before consuming them.

## TypeScript Guidance

- If the codebase uses TypeScript below 5.0, add `as const` to preserve literal values.
- Use `typeof MyEnum.valueType` for value unions and `typeof MyEnum.keyType` for key unions.
- Use `typeof MyEnum.rawType` when another API needs the initializer shape.
- When adding global extensions, also add the matching `declare module 'enum-plus/extension'` typing.

## UI and Localization Guidance

- For component option lists, prefer `enum.items` first.
- Use `toList` or `toMap` only when the consumer expects custom field names or a different shape.
- For React Ant Design helpers like `toSelect` or `toValueMap`, install the matching plugin first.
- For localization, prefer `Enum.install(...)` with an i18n plugin when one already exists for the stack; otherwise wire `Enum.localize`.
- If the task also changes Vue, antdv-next, or repo-specific UI code, load the matching repo skill alongside this one.

Read [`references/integration-patterns.md`](./references/integration-patterns.md) for concrete integration patterns.

## Common Moves

- Replace `switch`-based label lookup with `enum.label(value)`.
- Replace separate `options` arrays with `enum.items` or `enum.toList(...)`.
- Replace ad hoc reverse maps with `enum.key(value)` or `enum.findBy(...)`.
- Replace duplicated metadata tables with enum item `raw` fields.
- Convert an existing native `enum` with `Enum(NativeEnum)` when incremental migration is safer than a rewrite.

## References

- [`references/core-api.md`](./references/core-api.md): initializer formats, instance API, static API, config, and TS-only types.
- [`references/integration-patterns.md`](./references/integration-patterns.md): UI binding, plugin usage, localization, conflicts, and best practices.

## Constraints

- Do not claim plugin methods exist unless the plugin was installed.
- Do not assume `label` is localized unless `Enum.localize` or an i18n plugin is configured.
- Do not hand-roll mutable edits against `enum.items`; treat enum collections as read-only.
