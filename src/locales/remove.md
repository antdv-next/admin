# 移除多语言文档

本文档是给大模型执行“彻底移除本仓库多语言能力”时使用的说明。

目标不是只删掉 `src/locales` 目录，而是把所有和多语言相关的目录、插件、类型、接线、依赖、调用点一起移除，避免残留死代码、残留生成物、残留类型声明、残留虚拟模块引用。

## 总原则

- 这是“移除整个多语言能力”，不是“删除某一种语言”。
- 只要某个文件、配置、导入、类型、虚拟模块、调用点是为多语言服务的，都应一并移除。
- 删除后，项目中不应再出现 `vue-i18n`、`virtual:i18n-messages`、`setupI18n`、页面级 `locales` 目录、i18n 插件生成类型等痕迹。
- 移除时不能只删除翻译调用，还必须把界面文案替换成实际字符串。

## 文案替换策略

移除多语言时，所有原本依赖语言包的文案，都应替换为项目中某一种已配置语言的实际文案值，而不是留下空字符串、占位符或未实现逻辑。

### 执行前的第一步

当用户要求“移除多语言”时，第一句话必须先询问用户：

- 要使用哪一种已配置语言作为最终保留文案

不能直接开始删除，也不能在没有确认的情况下默认使用某个语言。

推荐提问方式：

- `移除多语言后，界面文案需要保留哪一种已配置语言？例如 zh-CN 或 en-US。`

只有在用户回答之后，才继续执行移除任务。

如果用户没有回答、回答不明确、或者给出的语言不在当前项目已配置语言里，则不能继续删除，应先澄清。

### 执行规则

- 必须先询问用户要保留哪一种已配置语言
- 用户明确指定后，统一使用该语言替换所有 `t()`、`$t()`、`useI18n()` 取出的文案
- 只能从项目里已经存在的语言文件中取值，不要凭空翻译或重写业务文案
- 如果某个 key 在用户指定语言中缺失，应先暂停并说明缺失项，必要时再询问是否允许回退到其他已配置语言
- 如果没有用户明确许可，不要自动回退到其他语言
- 如果目标语言和备选语言都没有该 key，不能静默删除，必须标记出来并说明该文案缺失

### 替换目标

以下内容在移除时都应替换成普通字符串或普通常量，而不是继续保留 i18n 调用：

- `t('xxx')`
- `$t('xxx')`
- `useI18n()` 返回的 `t`
- 基于多语言 key 生成的 `title`、`label`、`placeholder`、`message`、`description`
- 路由 meta、菜单配置、表格列配置、表单配置中的翻译 key

### 不允许的做法

- 只删除 `useI18n` 导入，但保留 `t(...)`
- 把翻译调用替换成空字符串
- 手工猜测文案含义并重新写一套新文案
- 不读取现有语言文件，直接把 key 原样显示在界面上
- 删除语言文件后，不处理依赖这些 key 的页面和配置

## 必须移除的目录和文件

### 1. 全局语言目录

删除以下目录和文件：

- `src/locales/**`

当前典型文件包括：

- `src/locales/index.ts`
- `src/locales/zh-CN/**`
- `src/locales/en-US/**`
- `src/locales/remove.md`

说明：

- `src/locales/<locale>/**/*.ts` 是全局语言源文件。
- `src/locales/index.ts` 是 `createI18n` 的初始化入口。
- `src/locales/<locale>/index.ts` 即使只是占位文件，也属于多语言体系的一部分。

### 2. 页面级语言目录

删除所有页面内的 `locales` 目录，包括但不限于：

- `src/pages/**/locales/**`
- `apps/*/pages/**/locales/**`

当前已存在的例子：

- `src/pages/error/locales/en-US.ts`
- `src/pages/error/locales/zh-CN.ts`

说明：

- 这类目录是页面级多语言入口。
- 即使文件内容是空对象，也必须删除。
- 后续如果 `apps/*` 里新增了 `pages/**/locales/<locale>.ts`，同样属于必须删除范围。

### 3. 子应用全局语言目录

删除所有子应用语言目录：

- `apps/*/locales/**`

说明：

- 即使当前仓库里还没有实际文件，也要按这个规则处理。
- 这类目录是 `apps/<app>` 级别的全局多语言来源。

### 4. i18n 插件实现

删除整个插件目录：

- `plugins/i18n/**`

当前典型文件包括：

- `plugins/i18n/index.ts`
- `plugins/i18n/options.ts`
- `plugins/i18n/scan.ts`
- `plugins/i18n/namespace.ts`
- `plugins/i18n/merge.ts`
- `plugins/i18n/runtime.ts`
- `plugins/i18n/dts.ts`
- `plugins/i18n/constants.ts`
- `plugins/i18n/README.md`

说明：

- 这部分是多语言扫描、聚合、懒加载、类型生成、虚拟模块接线的核心实现。

### 5. i18n 相关测试

删除所有 i18n 插件测试：

- `plugins/__tests__/i18n-plugin.spec.ts`
- `plugins/__tests__/i18n-dts.spec.ts`

### 6. i18n 生成产物和声明文件

删除以下生成物：

- `types/i18n.d.ts`
- `types/i18n-virtual.d.ts`

说明：

- 这些文件是多语言类型提示和虚拟模块声明，不应残留。

## 必须修改的接线点

### 1. 应用入口

检查并修改：

- `src/main.ts`

需要移除：

- `import { setupI18n } from '@/locales'`
- `await setupI18n(app)`

删除后要确保应用仍能正常启动。

### 2. locale 组合式 API

检查并删除：

- `src/composables/locale.ts`

如果该文件只服务于多语言，应直接删除整个文件。
如果后续这个文件承担了别的职责，则至少移除所有 i18n 相关内容，包括：

- `I18n` 类型
- `loadI18n`
- `setI18n`
- `setI18nLanguage`
- `loadLocaleMessage`
- `changeLocale`
- `setLocaleMessage`
- `availableLocales`
- `document.documentElement.lang` 的语言同步逻辑

### 3. Vite 插件注册

检查并修改：

- `plugins/index.ts`

需要移除：

- `import { i18n } from './i18n'`
- 插件数组中的 `i18n(...)`

### 4. 自动导入配置

检查并修改：

- `plugins/index.ts`
- `vitest.config.ts`

如果 `autoImport` 或其他工具配置里包含：

- `'vue-i18n'`

则应从自动导入列表中移除。

删除后应重新生成对应类型文件，避免 `types/auto-imports.d.ts` 残留 i18n 自动导入声明。

### 5. 依赖

检查并修改：

- `package.json`

需要移除：

- `vue-i18n`

如果后续发现其他依赖仅仅是为多语言服务，也应一并移除。

## 必须移除的代码特征

只要代码里出现以下特征，通常都说明它与多语言相关，应该删除或替换。

### 1. `vue-i18n` 相关导入

包括但不限于：

- `import { createI18n } from 'vue-i18n'`
- `import type { I18n } from 'vue-i18n'`
- `import { useI18n } from 'vue-i18n'`

其中 `useI18n` 需要单独重点扫描，因为它通常直接出现在页面、组件、hooks 中，不一定会经过 `src/locales` 或 `src/composables/locale.ts`。

### 2. 虚拟模块导入

包括但不限于：

- `import messages from 'virtual:i18n-messages'`
- `import { loadI18n } from 'virtual:i18n-messages'`

### 3. i18n 实例操作

包括但不限于：

- `createI18n(...)`
- `i18n.global`
- `i18n.global.locale`
- `i18n.global.setLocaleMessage(...)`
- `i18n.global.availableLocales`

### 4. 翻译调用

包括但不限于：

- `useI18n()`
- `t('xxx')`
- `$t('xxx')`

只要这些调用是为了界面文案翻译，就都应移除或替换成普通字符串方案。

注意：

- 这里的“替换”不是随意改写，而是要从项目现有语言包中取目标语言的真实文案值
- 必须先由用户明确指定要保留的语言
- 未经用户确认，不要默认选择 `zh-CN`、`en-US` 或其他语言

### 5. 语言切换逻辑

包括但不限于：

- `setI18nLanguage`
- `loadLocaleMessage`
- `changeLocale`
- `loadI18n`
- 与语言切换相关的 `watch`、按钮、菜单、下拉项、状态存储

### 6. 语言资源导入

语言文件中经常会出现这类导入，也属于多语言资源：

- `antdv-next/locale/...`
- `dayjs/locale/...`

如果这些导入只存在于多语言文件中，随语言文件一起删除即可。
如果项目其他地方仍然需要固定语言的 `dayjs` 或组件库 locale，请在移除多语言后改成单独的固定接入，不要直接保留旧多语言结构。

## 必须扫描的路径模式

执行移除时，至少扫描以下路径：

- `src/locales/**`
- `src/pages/**/locales/**`
- `apps/*/locales/**`
- `apps/*/pages/**/locales/**`
- `plugins/i18n/**`
- `plugins/__tests__/i18n-*.spec.ts`
- `types/i18n*.d.ts`
- `src/composables/locale.ts`
- `src/main.ts`
- `plugins/index.ts`
- `vitest.config.ts`
- `package.json`

## 建议使用的搜索关键词

移除时建议全文搜索以下关键词，确认没有遗漏：

- `vue-i18n`
- `createI18n`
- `useI18n`
- `useI18n()`
- `I18n`
- `virtual:i18n-messages`
- `loadI18n`
- `setupI18n`
- `setI18nLanguage`
- `loadLocaleMessage`
- `changeLocale`
- `setLocaleMessage`
- `availableLocales`
- `t(`
- `$t(`
- `/locales/`
- `antdv-next/locale/`
- `dayjs/locale/`

## 删除后的预期状态

删除完成后，应满足以下条件：

- 不再存在 `src/locales` 目录
- 不再存在任何 `pages/**/locales` 目录
- 不再存在 `apps/*/locales` 目录
- 不再存在 `plugins/i18n` 目录
- 不再存在 `types/i18n.d.ts` 和 `types/i18n-virtual.d.ts`
- `plugins/index.ts` 中不再注册 i18n 插件
- `src/main.ts` 中不再调用 `setupI18n`
- `package.json` 中不再依赖 `vue-i18n`
- 全仓库不再出现 `vue-i18n`、`virtual:i18n-messages`、`useI18n`、`createI18n`、`t(`、`$t(` 等多语言调用
- 原本依赖多语言的界面文案已经被用户指定语言的实际文案替换，不再依赖 key 查表

## 删除后的验证

删除完成后，至少做以下验证：

- 运行类型检查，确认没有残留 i18n 类型错误
- 运行 lint / check，确认没有残留导入或死代码
- 确认入口文件不再依赖 i18n 初始化
- 确认页面中没有残留的语言切换 UI 或翻译函数调用

## 额外说明

如果某些页面文案原本依赖 `t('...')`，移除多语言后不能只删掉导入而保留空调用，必须把这些调用改成项目现有语言包里的实际文案值，并且所用语言必须先由用户明确指定。

如果某些类型文件、自动导入文件、生成文件是由工具生成出来的，不要只手改生成产物；应同时移除对应的生成逻辑或插件接线，避免后续再次生成回来。
