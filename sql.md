# 现有表结构说明

说明：本文档根据 `/Users/zhuzhengjian/workspace/gitea/antdv-next/admin/server/db/schema` 下的 Drizzle Schema 整理，字段名以实际数据库列名为准。

## `sys_user`

| 字段名 | TypeScript 字段 | 类型 | 长度 | 可空 | 默认值 | 描述 |
| --- | --- | --- | --- | --- | --- | --- |
| `id` | `id` | `uuid` | - | 否 | `uuidv7()` | 主键 ID |
| `tenant_id` | `tenantId` | `uuid` | - | 否 | `00000000-0000-0000-0000-000000000000` | 租户 ID，预留字段 |
| `dept_id` | `deptId` | `uuid` | - | 否 | `00000000-0000-0000-0000-000000000000` | 部门 ID，用户主部门，冗余字段 |
| `username` | `username` | `varchar` | `64` | 否 | - | 用户名 |
| `password` | `password` | `varchar` | `255` | 否 | - | 密码哈希 |
| `nickname` | `nickname` | `varchar` | `64` | 是 | - | 昵称 |
| `real_name` | `realName` | `varchar` | `64` | 是 | - | 真实姓名 |
| `email` | `email` | `varchar` | `128` | 是 | - | 邮箱 |
| `phone` | `phone` | `varchar` | `32` | 是 | - | 手机号 |
| `avatar` | `avatar` | `varchar` | `255` | 是 | - | 头像 |
| `gender` | `gender` | `smallint` | - | 是 | `0` | 性别：0 未知，1 男，2 女 |
| `status` | `status` | `smallint` | - | 否 | `1` | 状态：1 启用，0 禁用 |
| `is_super_admin` | `isSuperAdmin` | `smallint` | - | 否 | `0` | 是否超级管理员：1 是，0 否 |
| `last_login_ip` | `lastLoginIp` | `varchar` | `64` | 是 | - | 最后登录 IP |
| `last_login_at` | `lastLoginAt` | `timestamp` | - | 是 | - | 最后登录时间 |
| `remark` | `remark` | `varchar` | `255` | 是 | - | 备注 |
| `created_by` | `createdBy` | `uuid` | - | 是 | - | 创建人 |
| `updated_by` | `updatedBy` | `uuid` | - | 是 | - | 更新人 |
| `created_at` | `createdAt` | `timestamp` | - | 否 | `now()` | 创建时间 |
| `updated_at` | `updatedAt` | `timestamp` | - | 否 | `now()`，更新时自动写入当前时间 | 更新时间 |
| `is_deleted` | `isDeleted` | `smallint` | - | 否 | `0` | 逻辑删除：1 已删除，0 未删除 |
| `version` | `version` | `integer` | - | 否 | `0` | 乐观锁版本号 |

| 索引/约束名 | 类型 | 字段 |
| --- | --- | --- |
| `PRIMARY KEY` | 主键 | `id` |
| `uk_tenant_username` | 唯一索引 | `tenant_id`, `username` |
| `idx_tenant_status` | 普通索引 | `tenant_id`, `status` |
| `idx_tenant_dept` | 普通索引 | `tenant_id`, `dept_id` |

## `sys_role`

| 字段名 | TypeScript 字段 | 类型 | 长度 | 可空 | 默认值 | 描述 |
| --- | --- | --- | --- | --- | --- | --- |
| `id` | `id` | `uuid` | - | 否 | `uuidv7()` | 主键 ID |
| `tenant_id` | `tenantId` | `uuid` | - | 否 | `00000000-0000-0000-0000-000000000000` | 租户 ID，预留字段 |
| `role_name` | `roleName` | `varchar` | `64` | 否 | - | 角色名称 |
| `role_code` | `roleCode` | `varchar` | `64` | 否 | - | 角色编码 |
| `status` | `status` | `smallint` | - | 否 | `1` | 状态：1 启用，0 禁用 |
| `sort` | `sort` | `integer` | - | 否 | `0` | 排序 |
| `is_system` | `isSystem` | `smallint` | - | 否 | `0` | 是否系统内置角色：1 是，0 否 |
| `remark` | `remark` | `varchar` | `255` | 是 | - | 备注 |
| `created_by` | `createdBy` | `uuid` | - | 是 | - | 创建人 |
| `updated_by` | `updatedBy` | `uuid` | - | 是 | - | 更新人 |
| `created_at` | `createdAt` | `timestamp` | - | 否 | `now()` | 创建时间 |
| `updated_at` | `updatedAt` | `timestamp` | - | 否 | `now()`，更新时自动写入当前时间 | 更新时间 |
| `is_deleted` | `isDeleted` | `smallint` | - | 否 | `0` | 逻辑删除：1 已删除，0 未删除 |
| `version` | `version` | `integer` | - | 否 | `0` | 乐观锁版本号 |

| 索引/约束名 | 类型 | 字段 |
| --- | --- | --- |
| `PRIMARY KEY` | 主键 | `id` |
| `uk_tenant_role_code` | 唯一索引 | `tenant_id`, `role_code` |
| `idx_tenant_status` | 普通索引 | `tenant_id`, `status` |

## `sys_menu`

| 字段名 | TypeScript 字段 | 类型 | 长度 | 可空 | 默认值 | 描述 |
| --- | --- | --- | --- | --- | --- | --- |
| `id` | `id` | `uuid` | - | 否 | `uuidv7()` | 主键 ID |
| `tenant_id` | `tenantId` | `uuid` | - | 否 | `00000000-0000-0000-0000-000000000000` | 租户 ID，预留字段 |
| `parent_id` | `parentId` | `uuid` | - | 是 | - | 父级 ID |
| `menu_type` | `menuType` | `smallint` | - | 否 | `1` | 类型：1 目录，2 菜单，3 按钮 |
| `menu_name` | `menuName` | `varchar` | `64` | 否 | - | 菜单名称 |
| `menu_code` | `menuCode` | `varchar` | `64` | 否 | - | 菜单编码 |
| `route_name` | `routeName` | `varchar` | `64` | 是 | - | 路由名称 |
| `route_path` | `routePath` | `varchar` | `64` | 是 | - | 路由路径 |
| `component` | `component` | `varchar` | `64` | 是 | - | 组件路径地址 |
| `permission_code` | `permissionCode` | `varchar` | `32` | 是 | - | 权限标识，如 `system:user:add` |
| `icon` | `icon` | `varchar` | `32` | 是 | - | 图标 |
| `visible` | `visible` | `smallint` | - | 是 | `1` | 菜单是否显示：1 显示，0 隐藏 |
| `status` | `status` | `smallint` | - | 是 | `1` | 状态：1 启用，0 禁用 |
| `keepAlive` | `keepAlive` | `smallint` | - | 是 | `0` | 是否缓存：1 启用，0 禁用 |
| `sort` | `sort` | `integer` | - | 否 | `0` | 排序，数字越大越靠前 |
| `remark` | `remark` | `varchar` | `255` | 是 | - | 备注 |
| `created_by` | `createdBy` | `uuid` | - | 是 | - | 创建人 |
| `updated_by` | `updatedBy` | `uuid` | - | 是 | - | 更新人 |
| `created_at` | `createdAt` | `timestamp` | - | 否 | `now()` | 创建时间 |
| `updated_at` | `updatedAt` | `timestamp` | - | 否 | `now()`，更新时自动写入当前时间 | 更新时间 |
| `is_deleted` | `isDeleted` | `smallint` | - | 否 | `0` | 逻辑删除：1 已删除，0 未删除 |
| `version` | `version` | `integer` | - | 否 | `0` | 乐观锁版本号 |

| 索引/约束名 | 类型 | 字段 |
| --- | --- | --- |
| `PRIMARY KEY` | 主键 | `id` |
| `uk_tenant_menu_code` | 唯一索引 | `tenant_id`, `menu_code` |
| `idx_tenant_parent` | 普通索引 | `tenant_id`, `parent_id` |
| `idx_tenant_type_status` | 普通索引 | `tenant_id`, `menu_type`, `status` |

## `sys_config`

| 字段名 | TypeScript 字段 | 类型 | 长度 | 可空 | 默认值 | 描述 |
| --- | --- | --- | --- | --- | --- | --- |
| `id` | `id` | `uuid` | - | 否 | `uuidv7()` | 主键 ID |
| `tenant_id` | `tenantId` | `uuid` | - | 否 | `00000000-0000-0000-0000-000000000000` | 租户 ID，预留字段 |
| `config_key` | `configKey` | `varchar` | `128` | 否 | - | 配置键 |
| `config_value` | `configValue` | `text` | - | 是 | - | 配置值 |
| `value_type` | `valueType` | `smallint` | - | 是 | `1` | 值类型：1 字符串，2 数字，3 布尔，4 JSON |
| `is_builtin` | `isBuiltin` | `smallint` | - | 是 | `0` | 是否系统内置 |
| `remark` | `remark` | `varchar` | `255` | 是 | - | 备注 |
| `created_at` | `createdAt` | `timestamp` | - | 否 | `now()` | 创建时间 |
| `updated_at` | `updatedAt` | `timestamp` | - | 否 | `now()`，更新时自动写入当前时间 | 更新时间 |

| 索引/约束名 | 类型 | 字段 |
| --- | --- | --- |
| `PRIMARY KEY` | 主键 | `id` |
| `uk_tenant_key` | 唯一约束 | `tenant_id`, `config_key` |

## `sys_dict_type`

| 字段名 | TypeScript 字段 | 类型 | 长度 | 可空 | 默认值 | 描述 |
| --- | --- | --- | --- | --- | --- | --- |
| `id` | `id` | `uuid` | - | 否 | `uuidv7()` | 主键 ID |
| `tenant_id` | `tenantId` | `uuid` | - | 否 | `00000000-0000-0000-0000-000000000000` | 租户 ID，预留字段 |
| `dict_name` | `dictName` | `varchar` | `64` | 否 | - | 字典名称 |
| `dict_code` | `dictCode` | `varchar` | `64` | 否 | - | 字典编码 |
| `status` | `status` | `smallint` | - | 否 | `1` | 状态：1 启用，0 禁用 |
| `remark` | `remark` | `varchar` | `255` | 是 | - | 备注 |
| `created_by` | `createdBy` | `uuid` | - | 是 | - | 创建人 |
| `updated_by` | `updatedBy` | `uuid` | - | 是 | - | 更新人 |
| `created_at` | `createdAt` | `timestamp` | - | 否 | `now()` | 创建时间 |
| `updated_at` | `updatedAt` | `timestamp` | - | 否 | `now()`，更新时自动写入当前时间 | 更新时间 |
| `is_deleted` | `isDeleted` | `smallint` | - | 否 | `0` | 逻辑删除 |
| `version` | `version` | `integer` | - | 否 | `0` | 乐观锁版本号 |

| 索引/约束名 | 类型 | 字段 |
| --- | --- | --- |
| `PRIMARY KEY` | 主键 | `id` |
| `uk_tenant_dict_code` | 唯一约束 | `tenant_id`, `dict_code` |
| `idx_tenant_status` | 普通索引 | `tenant_id`, `status` |

## `sys_dict_item`

| 字段名 | TypeScript 字段 | 类型 | 长度 | 可空 | 默认值 | 描述 |
| --- | --- | --- | --- | --- | --- | --- |
| `id` | `id` | `uuid` | - | 否 | `uuidv7()` | 主键 ID |
| `tenant_id` | `tenantId` | `uuid` | - | 否 | `00000000-0000-0000-0000-000000000000` | 租户 ID，预留字段 |
| `dict_type_id` | `dictTypeId` | `uuid` | - | 否 | - | 字典类型 ID |
| `label` | `label` | `varchar` | `64` | 否 | - | 字典标签 |
| `value` | `value` | `varchar` | `64` | 否 | - | 字典值 |
| `tag_type` | `tagType` | `varchar` | `32` | 是 | - | 标签类型，如 `success/info/warning/danger` |
| `css_class` | `cssClass` | `varchar` | `64` | 是 | - | 样式类名 |
| `sort` | `sort` | `integer` | - | 否 | `0` | 排序 |
| `is_default` | `isDefault` | `smallint` | - | 否 | `0` | 是否默认项：1 是，0 否 |
| `status` | `status` | `smallint` | - | 否 | `1` | 状态：1 启用，0 禁用 |
| `remark` | `remark` | `varchar` | `255` | 是 | - | 备注 |
| `created_by` | `createdBy` | `uuid` | - | 是 | - | 创建人 |
| `updated_by` | `updatedBy` | `uuid` | - | 是 | - | 更新人 |
| `created_at` | `createdAt` | `timestamp` | - | 否 | `now()` | 创建时间 |
| `updated_at` | `updatedAt` | `timestamp` | - | 否 | `now()`，更新时自动写入当前时间 | 更新时间 |
| `is_deleted` | `isDeleted` | `smallint` | - | 否 | `0` | 逻辑删除 |
| `version` | `version` | `integer` | - | 否 | `0` | 乐观锁版本号 |

| 索引/约束名 | 类型 | 字段 |
| --- | --- | --- |
| `PRIMARY KEY` | 主键 | `id` |
| `uk_tenant_dict_type_value` | 唯一约束 | `tenant_id`, `dict_type_id`, `value` |
| `idx_tenant_dict_type` | 普通索引 | `tenant_id`, `dict_type_id` |
| `idx_tenant_status` | 普通索引 | `tenant_id`, `status` |

## `sys_user_role`

| 字段名 | TypeScript 字段 | 类型 | 长度 | 可空 | 默认值 | 描述 |
| --- | --- | --- | --- | --- | --- | --- |
| `id` | `id` | `uuid` | - | 否 | `uuidv7()` | 主键 ID |
| `tenant_id` | `tenantId` | `uuid` | - | 否 | `00000000-0000-0000-0000-000000000000` | 租户 ID，预留字段 |
| `user_id` | `userId` | `uuid` | - | 否 | - | 用户 ID |
| `role_id` | `roleId` | `uuid` | - | 否 | - | 角色 ID |
| `created_at` | `createdAt` | `timestamp` | - | 否 | `now()` | 创建时间 |

| 索引/约束名 | 类型 | 字段 |
| --- | --- | --- |
| `PRIMARY KEY` | 主键 | `id` |
| `uk_tenant_user_role` | 唯一索引 | `tenant_id`, `user_id`, `role_id` |
| `idx_tenant_role` | 普通索引 | `tenant_id`, `role_id` |

## `sys_role_menu`

| 字段名 | TypeScript 字段 | 类型 | 长度 | 可空 | 默认值 | 描述 |
| --- | --- | --- | --- | --- | --- | --- |
| `id` | `id` | `uuid` | - | 否 | `uuidv7()` | 主键 ID |
| `tenant_id` | `tenantId` | `uuid` | - | 否 | `00000000-0000-0000-0000-000000000000` | 租户 ID，预留字段 |
| `role_id` | `roleId` | `uuid` | - | 否 | - | 角色 ID |
| `menu_id` | `menuId` | `uuid` | - | 否 | - | 菜单 ID |
| `created_at` | `createdAt` | `timestamp` | - | 否 | `now()` | 创建时间 |

| 索引/约束名 | 类型 | 字段 |
| --- | --- | --- |
| `PRIMARY KEY` | 主键 | `id` |
| `uk_tenant_role_menu` | 唯一索引 | `tenant_id`, `role_id`, `menu_id` |
| `idx_tenant_menu` | 普通索引 | `tenant_id`, `menu_id` |

## `sys_login_log`

| 字段名 | TypeScript 字段 | 类型 | 长度 | 可空 | 默认值 | 描述 |
| --- | --- | --- | --- | --- | --- | --- |
| `id` | `id` | `uuid` | - | 否 | `uuidv7()` | 主键 ID |
| `tenant_id` | `tenantId` | `uuid` | - | 否 | `00000000-0000-0000-0000-000000000000` | 租户 ID，预留字段 |
| `user_id` | `userId` | `uuid` | - | 是 | - | 用户 ID |
| `user_name` | `username` | `varchar` | `64` | 是 | - | 登录用户名 |
| `login_type` | `loginType` | `smallint` | - | 否 | `1` | 登录类型：1 PC，2 移动端，3 其他 |
| `login_ip` | `loginIp` | `varchar` | `64` | 是 | - | 登录 IP |
| `login_location` | `loginLocation` | `varchar` | `128` | 是 | - | 登录地点 |
| `user_agent` | `userAgent` | `varchar` | `512` | 是 | - | UA |
| `browser` | `browser` | `varchar` | `128` | 是 | - | 浏览器 |
| `os` | `os` | `varchar` | `128` | 是 | - | 登录系统 |
| `device` | `device` | `varchar` | `128` | 是 | - | 设备信息 |
| `status` | `status` | `smallint` | - | 否 | `1` | 登录结果：1 成功，0 失败 |
| `fail_reason` | `failReason` | `varchar` | `255` | 是 | - | 错误原因 |
| `login_at` | `loginAt` | `timestamp` | - | 否 | `now()` | 登录时间 |

| 索引/约束名 | 类型 | 字段 |
| --- | --- | --- |
| `PRIMARY KEY` | 主键 | `id` |
| `idx_tenant_user` | 普通索引 | `tenant_id`, `user_id` |
| `idx_tenant_status` | 普通索引 | `tenant_id`, `status` |
| `idx_login_at` | 普通索引 | `login_at` |

## `sys_operation_log`

| 字段名 | TypeScript 字段 | 类型 | 长度 | 可空 | 默认值 | 描述 |
| --- | --- | --- | --- | --- | --- | --- |
| `id` | `id` | `uuid` | - | 否 | `uuidv7()` | 主键 ID |
| `tenant_id` | `tenantId` | `uuid` | - | 否 | `00000000-0000-0000-0000-000000000000` | 租户 ID，预留字段 |
| `user_id` | `userId` | `uuid` | - | 是 | - | 操作用户 ID |
| `user_name` | `username` | `varchar` | `64` | 是 | - | 用户名 |
| `module_name` | `moduleName` | `varchar` | `64` | 是 | - | 模块名称 |
| `business_type` | `businessType` | `varchar` | `32` | 是 | - | 业务类型：`INSERT/UPDATE/DELETE/EXPORT/IMPORT/LOGIN/OTHER` |
| `method` | `method` | `varchar` | `255` | 是 | - | 方法名 |
| `request_method` | `requestMethod` | `varchar` | `16` | 是 | - | 请求方式 |
| `request_url` | `requestUrl` | `varchar` | `255` | 是 | - | 请求 URL |
| `permission_code` | `permissionCode` | `varchar` | `128` | 是 | - | 权限标识 |
| `request_ip` | `requestIp` | `varchar` | `64` | 是 | - | 请求 IP |
| `request_location` | `requestLocation` | `varchar` | `128` | 是 | - | 请求地点 |
| `user_agent` | `userAgent` | `varchar` | `512` | 是 | - | User-Agent |
| `request_params` | `requestParams` | `json` | - | 是 | - | 请求参数 |
| `response_data` | `responseData` | `json` | - | 是 | - | 响应数据 |
| `execution_time_ms` | `executionTimeMs` | `integer` | - | 是 | - | 执行耗时（毫秒） |
| `status` | `status` | `smallint` | - | 否 | `1` | 执行状态：1 成功，0 失败 |
| `error_message` | `errorMessage` | `varchar` | `2000` | 是 | - | 错误信息 |
| `operated_at` | `operatedAt` | `timestamp` | - | 否 | `now()` | 操作时间 |

| 索引/约束名 | 类型 | 字段 |
| --- | --- | --- |
| `PRIMARY KEY` | 主键 | `id` |
| `idx_tenant_user` | 普通索引 | `tenant_id`, `user_id` |
| `idx_tenant_module` | 普通索引 | `tenant_id`, `module_name` |
| `idx_tenant_status` | 普通索引 | `tenant_id`, `status` |
| `idx_operated_at` | 普通索引 | `operated_at` |
