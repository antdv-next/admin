# Components

## UI Library Constraint

- The component library for this repo is `antdv-next`.
- Do not replace a requirement with another UI library.
- If `antdv-next/skills` is configured in the environment, use it by default before falling back to generic component decisions.

## Semantic DOM Guidance

- If a task mentions semantic DOM or asks to modify a specific semantic structure, prefer the `antdv-next` semantic configuration surface instead of ad-hoc DOM rewrites.
- If a requirement targets component `classes`, extend the semantic configuration to match the existing `antdv-next` structure instead of bypassing it.

## Styling Guidance

- Keep component styling in Tailwind classes first.
- Only add extra CSS when overriding third-party internals or expressing non-utility values.
