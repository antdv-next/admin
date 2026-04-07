# 多语言插件

## 当前能力

- 扫描 `src` 和 `apps/*` 下的多语言文件
- 基于文件路径生成嵌套命名空间
- 将多来源语言对象做深合并，不做静默替换
- 生成 `types/i18n.d.ts`，为 `vue-i18n` 提供类型提示
- 提供 `virtual:i18n-messages` 作为运行时聚合消息入口

## 扫描规则

- 全局语言包：
  - `src/locales/<locale>/**/*.ts`
  - `apps/<app>/locales/<locale>/**/*.ts`
- 页面语言包：
  - `src/pages/**/locales/<locale>.ts`
  - `apps/<app>/pages/**/locales/<locale>.ts`

`pages/**/locales` 目录下只允许存在 `<locale>.ts` 形式的单文件入口。

## 路径映射

- `src/locales/zh-CN/workspace/overview.ts` -> `workspace.overview`
- `src/locales/zh-CN/workspace/overview/index.ts` -> `workspace.overview`
- `src/pages/error/locales/zh-CN.ts` -> `error`
- `src/pages/user/[id]/locales/zh-CN.ts` -> `user.$id`
- `apps/admin/locales/zh-CN/workspace/overview.ts` -> `admin.workspace.overview`
- `apps/admin/pages/error/locales/zh-CN.ts` -> `admin.error`

特殊规则：

- 末尾 `index` 会折叠掉
- `[id]` 会规范为 `$id`
- `[...all]` 会规范为 `$all`
- `[[id]]` 会规范为 `$id`

## 合并规则

- 对象 + 对象：递归深合并
- 基础值 + 基础值：报冲突
- 对象 + 基础值：报冲突
- 数组参与冲突：报错，不自动合并

## 类型生成

- 插件会生成 `types/i18n.d.ts`
- 类型来源于 `typeof import('...').default`
- 默认使用 `zh-CN` 作为 schema 基准
- 非基准语言会在 strict 模式下做结构一致性校验

## 可选扩展

- 聚合输出 JSON 到 `public/locales/*.json`
- 当前代码里只保留了扩展位，未默认启用
