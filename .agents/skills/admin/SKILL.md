---
name: admin
description: Use when working in this admin repo and you need the project-specific conventions for UI styling, antdv-next usage, route access control, dynamic route injection, or test project setup.
---

# Admin Skill

Use this skill for repo-specific conventions. Load only the reference file that matches the task.

## References

- CSS tokens and Tailwind usage:
  `references/css-and-theme.md`
- `antdv-next` component and semantic DOM constraints:
  `references/components.md`
- Route access, menu filtering, and dynamic route injection:
  `references/router-access.md`
- Sub-app structure, route discovery, and default module layouts:
  `references/sub-apps.md`
- `vite-plus` test imports, test placement, and test tsconfig:
  `references/testing.md`

## When To Read What

- Editing page styles, layout styles, or theme classes:
  read `references/css-and-theme.md`
- Building or adjusting UI components:
  read `references/components.md`
- Touching `src/router`, route meta, menu permissions, or auth guard:
  read `references/router-access.md`
- Adding a module under `apps/*`, or changing `apps/*/pages` and `apps/*/layouts`:
  read `references/sub-apps.md`
- Adding or moving tests, or fixing test editor/type errors:
  read `references/testing.md`
