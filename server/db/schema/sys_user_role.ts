import { index, pgTable, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core'
import { v7 as uuidv7 } from 'uuid'

// 用户角色关联表
export const sysUserRole = pgTable(
  'sys_user_role',
  {
    // 主键id
    id: uuid('id').primaryKey().$defaultFn(() => uuidv7()),
    // 租户 ID，预留字段；暂不建立租户表或外键关联
    tenantId: uuid('tenant_id').notNull().default('00000000-0000-0000-0000-000000000000'),
    // 用户id
    userId: uuid('user_id').notNull(),
    // 角色ID
    roleId: uuid('role_id').notNull(),
    // 创建时间
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  },
  table => [
    uniqueIndex('uk_tenant_user_role').on(table.tenantId, table.userId, table.roleId),
    index('idx_tenant_user_role').on(table.tenantId, table.roleId),
  ],
)
