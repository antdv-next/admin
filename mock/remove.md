# 移除 Mock 功能指南

本文档说明如何从当前项目中移除 Mock 功能。现在的 Mock 基于 `alova/fetch + @alova/mock`，不再依赖 axios 拦截器。

## 前置说明

当前 Mock 入口在 [alova.ts](/Users/zhuzhengjian/workspace/gitea/antdv-next/admin/src/utils/request/alova.ts)。项目启动时会根据 `VITE_APP_MOCK_ENABLED` 决定是否启用 `@alova/mock`，匹配到的请求直接返回 mock 响应，未匹配的请求会继续走真实 `fetch` 请求。

另外，请求本身还可以通过 `meta.mock` 覆盖全局行为：

- `meta.mock: true` - 当前请求强制走 mock
- `meta.mock: false` - 当前请求强制走真实接口
- 不传 `meta.mock` - 使用全局 `VITE_APP_MOCK_ENABLED`

如果你只是想临时关闭 Mock，不需要删除代码，直接把环境变量关掉就够了。只有在确认后端已经稳定、且不再需要本地 mock 回退时，才建议执行完整移除。

## 步骤一：删除 mock 数据目录

删除整个 `mock/` 目录：

```bash
rm -rf mock/
```

当前目录主要包含：

- `mock/index.ts` - Mock 兼容层和 `response` helper
- `mock/login/` - 登录相关 Mock
- `mock/user/` - 用户和菜单相关 Mock
- `mock/test/` - 请求演示页相关 Mock
- `mock/dev/` - 权限类型生成脚本的本地回退数据

## 步骤二：移除 alova 中的 Mock 适配器

修改 [alova.ts](/Users/zhuzhengjian/workspace/gitea/antdv-next/admin/src/utils/request/alova.ts)，删除 `@alova/mock` 相关逻辑，只保留真实 `fetch` 适配器。

**修改前：**

```ts
import { createAlovaMockAdapter } from '@alova/mock'
import adapterFetch from 'alova/fetch'

const requestAdapter = isMockEnabled()
  ? createAlovaMockAdapter(loadMockWrappers(), {
      delay: 0,
      httpAdapter,
      matchMode: 'methodurl',
    })
  : httpAdapter
```

**修改后：**

```ts
import adapterFetch from 'alova/fetch'

const requestAdapter = adapterFetch()
```

同时删除：

- `createAlovaMockAdapter` 的 import
- `import.meta.glob('../../../mock/**/*.ts', ...)`
- `loadMockWrappers`
- `isMockEnabled`

## 步骤三：移除 `@alova/mock` 依赖

执行：

```bash
pnpm remove @alova/mock
```

如果 `mock/` 目录已经删除，通常也可以把 `alova` 以外的 mock 兼容代码一起清掉。

## 步骤四：清理脚本中的 Mock 回退

当前 [gen-per-type.ts](/Users/zhuzhengjian/workspace/gitea/antdv-next/admin/scripts/gen-per-type.ts) 在请求真实接口失败时，会回退到 `mock/dev/btns.ts`。如果你要彻底移除 Mock，需要把这段 fallback 一并删掉，或者保证开发环境下权限接口始终可访问。

建议把逻辑改成：

- 请求真实接口成功：继续生成权限类型
- 请求真实接口失败：直接报错，不再读取本地 mock

## 步骤五：更新 TypeScript 配置

修改 [tsconfig.app.json](/Users/zhuzhengjian/workspace/gitea/antdv-next/admin/tsconfig.app.json)，从 `include` 中移除 `mock/**/*.ts`：

**修改前：**

```json
{
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.vue",
    "types/**/*.d.ts",
    "server/**/*.ts",
    "apps/**/*.ts",
    "apps/**/*.tsx",
    "apps/**/*.vue",
    "mock/**/*.ts"
  ]
}
```

**修改后：**

```json
{
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.vue",
    "types/**/*.d.ts",
    "server/**/*.ts",
    "apps/**/*.ts",
    "apps/**/*.tsx",
    "apps/**/*.vue"
  ]
}
```

如果 `tsconfig.test.json` 里还保留了 `mock/**/*.spec.ts` 或 `mock/**/*.test.ts`，也需要一起移除。

## 步骤六：确认真实 API 配置

确认环境变量指向真实后端：

**.env.development**

```env
VITE_APP_MOCK_ENABLED=false
VITE_APP_BASE_API=http://localhost:3000/api
```

**.env.production**

```env
VITE_APP_MOCK_ENABLED=false
VITE_APP_BASE_API=https://api.example.com
```

## 步骤七：验证

1. 运行测试

```bash
pnpm vp test
```

2. 运行构建

```bash
pnpm build
```

3. 手动验证

- 登录功能是否走真实后端
- 用户信息和菜单请求是否正常返回
- 权限类型生成脚本是否仍可运行
- 控制台和网络面板中是否没有 mock 命中日志

## 注意事项

- 移除前确认后端接口已经可用，尤其是登录、用户信息、菜单和权限相关接口
- 如果 `scripts/gen-per-type.ts` 仍依赖 mock fallback，移除 `mock/dev/btns.ts` 之前要先处理脚本
- 如果只是临时联调，优先关闭 `VITE_APP_MOCK_ENABLED`，不要直接删代码

## 回滚方案

如果要恢复 Mock，可通过 Git 还原：

```bash
git checkout HEAD -- mock/ src/utils/request/alova.ts scripts/gen-per-type.ts tsconfig.app.json tsconfig.test.json package.json pnpm-lock.yaml
```

## 替代方案

### 方案一：只禁用 Mock，不删除代码

把环境变量改成：

```env
VITE_APP_MOCK_ENABLED=false
```

这是最推荐的临时切换方式。

如果只是局部联调，也可以只在单个接口上覆盖：

```ts
useGet('/user/info', {
  meta: { mock: false },
})
```

### 方案二：保留 mock 文件，但强制真实请求

在 [alova.ts](/Users/zhuzhengjian/workspace/gitea/antdv-next/admin/src/utils/request/alova.ts) 中直接固定：

```ts
const requestAdapter = httpAdapter
```

这样 mock 文件仍然保留，但运行时不会生效，后续需要恢复时只要把 adapter 选择逻辑加回来即可。
