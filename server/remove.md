# 移除 Server 功能指南

本文档说明如何从项目中移除 Server 端功能（包括 Nitro 服务器和数据库相关代码）。

## 前置说明

项目默认使用 `server/db/schema` 中定义的数据库 schema 自动生成类型。移除 Server 功能前，需要先处理所有相关的类型引用。

## 步骤一：处理类型引用

### 1.1 查找所有数据库类型引用

全局搜索 `#db/`，找到所有从 schema 导入类型的位置：

```bash
# 使用 grep 搜索
grep -r "#db/" src/
```

### 1.2 替换为自定义类型

针对每个引用，根据实际需求定义对应的 TypeScript 类型。

**示例：用户信息类型**

修改前（`src/api/user/index.ts`）：

```ts
import type { SysUser } from '#db/sys_user';

export type UserInfo = Omit<SysUser, 'password' | 'version' | 'isDeleted'>;
```

修改后：

```ts
export interface UserInfo {
  id: string;
  username: string;
  email: string;
  realName?: string;
  phone?: string;
  avatar?: string;
  status: number;
  createdAt: Date;
  updatedAt: Date;
}
```

> **提示**：根据后端 API 实际返回的数据结构定义类型，确保字段名称和类型准确。

### 1.3 常见需要处理的文件

- `src/api/**/*.ts` - API 接口定义
- `src/stores/**/*.ts` - Pinia Store
- `src/composables/**/*.ts` - 组合式函数
- `src/pages/**/*.vue` - 页面组件

## 步骤二：删除 Server 相关文件

```bash
# 删除服务器目录
rm -rf server/

# 删除 Nitro 配置文件
rm nitro.config.ts

# 删除 Drizzle 配置文件
rm drizzle.config.ts
```

## 步骤三：移除相关依赖

```bash
# 移除数据库相关依赖
pnpm remove drizzle-orm drizzle-kit pg @types/pg

# 移除 Nitro 依赖
pnpm remove nitro
```

## 步骤四：清理配置文件

### 4.1 更新 `vite.config.ts`

移除 Nitro 相关的 Vite 插件配置（如果有）。

### 4.2 更新 `package.json`

移除与 Server 相关的脚本命令：

- `db:*` 相关命令
- `server:*` 相关命令

### 4.3 更新 `tsconfig.app.json`

移除 Server 相关的路径别名配置和文件包含：

**移除前：**

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@apps/admin/*": ["apps/admin/src/*"],
      "#db/*": ["server/db/schema/*"] // 删除此行
    }
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.vue",
    "types/**/*.d.ts",
    "server/**/*.ts", // 删除此行
    "apps/**/*.ts",
    "apps/**/*.tsx",
    "apps/**/*.vue",
    "mock/**/*.ts"
  ]
}
```

**移除后：**

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@apps/admin/*": ["apps/admin/src/*"]
    }
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.vue",
    "types/**/*.d.ts",
    "apps/**/*.ts",
    "apps/**/*.tsx",
    "apps/**/*.vue",
    "mock/**/*.ts"
  ]
}
```

## 步骤五：调整 API 请求

确保所有 API 请求指向正确的后端服务地址。修改 `src/utils/request/instance.ts` 或相关的请求配置文件：

```ts
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
});
```

## 步骤六：验证和测试

1. **类型检查**

   ```bash
   pnpm run type-check
   ```

2. **构建测试**

   ```bash
   pnpm run build
   ```

3. **运行开发服务器**

   ```bash
   pnpm run dev
   ```

4. **功能测试**
   - 测试所有 API 调用是否正常
   - 验证类型提示是否正确
   - 检查是否有遗漏的类型错误

## 注意事项

- ⚠️ 移除前请确保已备份重要代码
- ⚠️ 确保后端 API 服务已就绪并可访问
- ⚠️ 建议在独立分支进行操作，测试通过后再合并
- ⚠️ 团队协作项目需提前沟通，确保不影响他人工作

## 回滚方案

如需恢复 Server 功能，可通过 Git 还原相关文件：

```bash
git checkout HEAD -- server/ nitro.config.ts drizzle.config.ts
pnpm install
```
