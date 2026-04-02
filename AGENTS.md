# Repository Guidelines

## Skills

- 使用本仓库约定时，优先读取 [admin skill](./.agents/skills/admin/SKILL.md)。
- 数据库、schema、迁移相关修改，优先读取 [drizzle-orm skill](./.agents/skills/drizzle-orm/SKILL.md)。
- 本项目 UI 组件库固定为 `antdv-next`，不要替换成其他组件库；如果已配置 `antdv-next/skills`，默认优先使用该 skill。

## Mock Data

- Changes under `mock/` that only adjust mock data, mock CRUD behavior, seed data, or mock response shaping do not require unit tests.
- Add tests for mock code only when the user explicitly requests them, or when the logic is extracted for reuse outside the mock layer.
