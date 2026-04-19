---
name: admin
description: Use when working in this admin repo and you need the project-specific conventions for UI styling, antdv-next usage, route access control, sub-app routing or layout plugin behavior, local icon conventions, dynamic route injection, or test project setup.
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
- Button permissions, generated permission types, `<Access>`, and `useAccess()`:
  `references/permissions.md`
- Sub-app pages, file-based routing, nested route shells, and scaffolding:
  `references/sub-app-routing.md`
- Removing a sub app and cleaning reverse dependencies:
  `references/sub-app-removal.md`
- Sub-app layouts, module default layout resolution, and layout plugin behavior:
  `references/sub-app-layouts.md`
- Local SVG icon conventions for global and sub-app scopes:
  `references/sub-app-icons.md`
- Stable absolute import aliases for sub-apps:
  `references/sub-app-aliases.md`
- `vite-plus` test imports, test placement, and test tsconfig:
  `references/testing.md`
- Query list + CRUD page composition, modal flows, mock conventions, and validation:
  `references/query-list-crud.md`
- Dictionary loading, global dict hints, and `useDict()` usage:
  `references/dict.md`

## When To Read What

- Editing page styles, layout styles, or theme classes:
  read `references/css-and-theme.md`
- Building or adjusting UI components:
  read `references/components.md`
- Touching `src/router`, route meta, menu permissions, or auth guard:
  read `references/router-access.md`
- Changing button permissions, permission code typing, `useAccess()`, or `<Access>`:
  read `references/permissions.md`
- Adding pages under `apps/*/pages`, debugging file-based routing, or creating a shared route shell like `/admin/user/**`:
  read `references/sub-app-routing.md`
- Removing a sub app under `apps/*`, or cleaning its alias, route, icon, or menu references:
  read `references/sub-app-removal.md`
- Adding or adjusting `apps/*/layouts`, changing `meta.layout`, or updating layout plugin defaults:
  read `references/sub-app-layouts.md`
- Adding or debugging local SVG icons in `src/assets/icons` or `apps/*/assets/icons`:
  read `references/sub-app-icons.md`
- Adding a stable absolute import alias for a sub-app:
  read `references/sub-app-aliases.md`
- Building a shared second-level page shell like `/admin/user/**` with common UI and child pages:
  read `references/sub-app-routing.md` first, then `references/router-access.md`
- Adding or moving tests, or fixing test editor/type errors:
  read `references/testing.md`
- Building a standard admin query-list page with search, table, modal save, and row delete:
  read `references/query-list-crud.md`
- Using global or page-level dictionaries, or calling `useDict()` helpers like `getLabel()` and `getOptions()`:
  read `references/dict.md`
