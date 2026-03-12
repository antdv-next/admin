# AGENT.md

## CSS 规范

- 本项目样式以 Tailwind CSS v4 utility class 为主，优先在模板的 `class` 中完成样式表达。
- 样式优先使用 `@antdv-next/tailwind/theme.css` 提供的 theme token，不直接写业务语义的硬编码颜色。
- 已经由 CSS Variable 承载的主题色，不要自行写 `isDark ? ... : ...` 来区分 dark mode。
- 能用 utility class 解决的问题，不额外新增 `style` 或 scoped CSS。
- 只有在 Tailwind 无法直接表达的复杂渐变、动态计算值、第三方组件覆盖等场景，才使用内联样式或额外 CSS。

## CSS 预设使用场景

### 1. 页面级容器

- 页面根容器优先使用 `bg-layout text-text`。
- 普通内容区优先使用 `bg-base` 或 `bg-container`。
- 弹层、浮层、需要更强层级感的区域优先使用 `bg-elevated`。

### 2. 卡片、面板、区块容器

- 普通卡片/面板优先使用 `border-border bg-container`。
- 需要浮层感或更强质感时，优先使用 `border-border bg-elevated shadow-card`。
- 次级分隔线优先使用 `border-border-sec`。

### 3. 文本

- 主文本使用 `text-text`。
- 说明文本、辅助信息使用 `text-text-secondary`。
- 更弱的提示、页脚、附属说明使用 `text-text-tertiary`。
- 品牌强调文本使用 `text-primary`。

### 4. 可点击文本和链接

- 链接、可点击文本、品牌强调文本，默认使用 `text-primary hover:text-primary-hover active:text-primary-active`。
- 普通导航文本如果默认是中性色，使用 `text-text-secondary hover:text-primary-hover active:text-primary-active`。

### 5. 背景强调和轻量提示

- 主色轻背景使用 `bg-primary-bg`。
- 主色弱强调可使用 `bg-primary/10`、`border-primary/30` 这类透明度写法。
- 信息态弱强调可使用 `bg-info/10`、`border-info-border`。

### 6. 边框

- 默认边框使用 `border-border`。
- 更弱的边框或分隔使用 `border-border-sec`。
- 主色态边框使用 `border-primary` 或 `border-primary/30`。

### 7. 阴影

- 卡片阴影优先使用 `shadow-card`。
- 通用阴影使用 `shadow`。
- 次级阴影使用 `shadow-sec`，更弱层级使用 `shadow-ter`。

### 8. 状态色

- 成功态使用 `success` 预设，例如 `text-success`、`bg-success-bg`、`border-success-border`。
- 警告态使用 `warning` 预设，例如 `text-warning`、`bg-warning-bg`、`border-warning-border`。
- 错误态使用 `error` 预设，例如 `text-error`、`bg-error-bg`、`border-error-border`。
- 信息态使用 `info` 预设，例如 `text-info`、`bg-info-bg`、`border-info-border`。

### 9. 允许保留自定义颜色的场景

- 演示代码高亮。
- 装饰性图形、品牌插画、编辑器红黄绿控制点等非业务语义元素。
- Tailwind token 无法满足的特殊视觉稿，但要优先评估能否改写为 theme token。

## 禁止项

- 不要写 `text-blue-500`、`bg-blue-50`、`border-cyan-400` 这类业务硬编码颜色。
- 不要写 `isDark ? 'border-white/10 text-gray-500' : 'border-gray-200 text-gray-400'` 这类纯样式分支。
- 不要为 light/dark 分别维护两套业务颜色，优先交给 theme token。

## 组件约束

- 本框架组件库硬性要求使用 `antdv-next`，不使用其他 UI 组件库替代；如本地已安装 `antdv-next/skills`，组件实现优先采用其中的最优用法。
- 如果需求涉及指定修改语义化 DOM，优先查看 `antdv-next/skills` 中的 `llms-semantic.md` 用法；针对指定的 `classes`，补充对应的语义化配置样式，并尽量与 `antdv-next` 的既有语义结构保持一致。
