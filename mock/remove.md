# 移除 Mock 功能指南

本文档说明如何从项目中移除 Mock 功能。Mock 功能主要用于开发阶段模拟后端接口，当后端 API 就绪后可以移除。

## 前置说明

项目的 Mock 功能设计相对独立和轻量，移除过程较为简单。Mock 拦截器会在开发模式下拦截 axios 请求，返回预定义的模拟数据。

## 步骤一：删除 Mock 目录

删除整个 mock 目录及其所有文件：

```bash
rm -rf mock/
```

该目录包含：

- `mock/index.ts` - Mock 服务入口
- `mock/login/` - 登录相关 Mock 数据
- `mock/user/` - 用户相关 Mock 数据
- `mock/test/` - 测试相关 Mock 数据

## 步骤二：移除 Mock 拦截器

删除注入给 axios 的 Mock 配置文件：

```bash
rm src/utils/request/guard/mock.ts
```

## 步骤三：清理请求拦截器引用

修改 `src/utils/request/instance.ts`（或相关的 axios 实例配置文件），移除 Mock 拦截器的引用：

**修改前：**

```ts
import { mockGuard } from './guard/mock'
import { requestGuard } from './guard/request'
import { responseGuard } from './guard/response'

// 注册拦截器
mockGuard(instance)
requestGuard(instance)
responseGuard(instance)
```

**修改后：**

```ts
import { requestGuard } from './guard/request'
import { responseGuard } from './guard/response'

// 注册拦截器
requestGuard(instance)
responseGuard(instance)
```

## 步骤四：更新 TypeScript 配置

修改 `tsconfig.app.json`，从 `include` 中移除 mock 目录：

**修改前：**

```json
{
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.vue",
    "types/**/*.d.ts",
    "apps/**/*.ts",
    "apps/**/*.tsx",
    "apps/**/*.vue",
    "mock/**/*.ts" // 删除此行
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
    "apps/**/*.ts",
    "apps/**/*.tsx",
    "apps/**/*.vue"
  ]
}
```

## 步骤五：配置真实 API 地址

确保所有 API 请求指向真实的后端服务。检查并配置环境变量：

**.env.development**

```env
VITE_API_BASE_URL=http://localhost:3000/api
# 或者你的后端 API 地址
```

**.env.production**

```env
VITE_API_BASE_URL=https://api.example.com
```

## 步骤六：验证和测试

1. **类型检查**

   ```bash
   pnpm run type-check
   ```

2. **启动开发服务器**

   ```bash
   pnpm run dev
   ```

3. **功能测试**
   - 测试登录功能是否正常
   - 验证所有 API 请求是否能正确访问后端
   - 检查控制台是否有请求错误
   - 确认数据加载和交互功能正常

4. **构建测试**
   ```bash
   pnpm run build
   ```

## 注意事项

- ⚠️ 移除前确保后端 API 已开发完成并可访问
- ⚠️ 检查所有使用 Mock 数据的接口是否已对接真实 API
- ⚠️ 建议在独立分支进行操作，测试通过后再合并
- ⚠️ 确保环境变量配置正确，避免请求到错误的地址

## 回滚方案

如需恢复 Mock 功能，可通过 Git 还原相关文件：

```bash
git checkout HEAD -- mock/ src/utils/request/guard/mock.ts
```

## 替代方案

如果只是临时需要切换到真实 API，可以：

1. **使用环境变量控制**

   在 `src/utils/request/instance.ts` 中：

   ```ts
   // 仅在开发环境且未禁用 Mock 时启用
   if (import.meta.env.DEV && !import.meta.env.VITE_DISABLE_MOCK) {
     mockGuard(instance)
   }
   ```

   然后通过环境变量控制：

   ```env
   # .env.development
   VITE_DISABLE_MOCK=true  # 禁用 Mock
   ```

2. **保留 Mock 代码但不注册**

   注释掉 Mock 拦截器的注册，保留代码供后续使用：

   ```ts
   // mockGuard(instance)  // 暂时禁用 Mock
   ```

这样可以在需要时快速恢复 Mock 功能，无需重新编写代码。
