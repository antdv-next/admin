# Antdv Next Admin

> [!NOTE]
> 目前项目处于早期阶段，功能和文档都不完善，可以作为一个技术预览来体验，后续会持续完善功能和文档，目前仅可参考，不建议使用，如果你想要参与到项目的开发中来，欢迎提交 Issue 或 PR 来共同维护本项目。

Antdv Next Admin 是一套基于 Antdv Next 组件库的后台管理系统模板，提供了一系列预设的页面和组件，帮助开发者快速搭建后台管理系统。

## 特点

- 基于 Antdv Next 组件库，提供了丰富的 UI 组件和样式。
- 提供了预设的页面和组件，帮助开发者快速搭建后台管理系统。
- 支持后端 mock 数据，方便开发和测试。
- 提供了 nitro 后端服务功能，小项目不需要再单开后端服务即可食用。
- AI支持，提供了丰富的 admin/skills 让 AI 更懂我们的框架。

## 安装

我们项目默认使用 `vite-plus` 作为基础框架，他默认是基于`pnpm`的 ，如果你还可以使用其他工具来安装我们的项目:

```bash
## vite-plus安装
vp install
## npm 安装
npm install
## yarn
yarn install
## pnpm
pnpm install
```

## 使用

我们提供了开箱即用的基础框架功能，你可以基于我们目前的功能进行扩展，或者直接使用我们提供的页面和组件来搭建你的后台管理系统。

```bash
# vp命令不要省略 run
vp run dev

# 你也可以直接使用
pnpm dev
```

## 构建

构建分为了两种模式，一种是纯前端构建，另一种是前后端一体化构建。

### 纯前端构建

如果你是不需要使用我们提供的后端服务功能，你可以通过环境变量`VITE_APP_NITRO_ENABLED=false`来设置关闭`nitro`后端服务功能，这样构建出来的项目就是一个纯前端项目，你可以将其部署到任何静态文件服务器上。

### 前后端一体化构建

如果你需要使用我们提供的后端服务功能，你可以通过环境变量`VITE_APP_NITRO_ENABLED=true`来设置开启`nitro`后端服务功能，这样构建出来的项目就是一个前后端一体化的项目，你可以将其部署到支持 Node.js 的服务器上。

也可以使用 `serverless` 部署到云函数上，具体部署方式可以参考`nitro`的官方文档。

构建出来的项目会输出到`.output`目录下，启动需要使用node环境来运行项目：

```bash
node ./.output/server/index.mjs
```

## AI支持

如果您是重度的 AI 使用者，我建议你先进行安装以下 skills:

```shell
# 通用配置
npx skills add antfu/skills

# antdv next 的配置
npx slills add antdv-next/skills

```

## 移除

我们给每个可以被移除的功能都添加了 `remove.md` 如果你不想手动移除某个功能，你可以直接把文档喂给 AI 来帮你移除对应的功能。

注意： 移除功能效果和您使用的模型相关，建议使用 `codex` 或 `claude code` 模型建议`gpt5.4/gpt5.3-codex` 或者`ops-4.6` 来进行移除效果更佳，其他的模型或者供应商，不保证移除效果。
