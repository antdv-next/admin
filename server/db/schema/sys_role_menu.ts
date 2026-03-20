import { index, pgTable, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core'
import { v7 as uuidv7 } from 'uuid'

export const sysRoleMenu = pgTable(
  'sys_role_menu',
  {
    // 主键id
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => uuidv7()),
    // 租户 ID，预留字段；暂不建立租户表或外键关联
    tenantId: varchar('tenant_id', { length: 36 }).notNull().default('00000000-0000-0000-0000-000000000000'),
    // 角色ID
    roleId: varchar('role_id', { length: 36 }).notNull(),
    // 菜单ID
    menuId: varchar('menu_id', { length: 36 }).notNull(),
    // 创建时间
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  },
  table => [
    uniqueIndex('uk_tenant_role_menu').on(table.tenantId, table.roleId, table.menuId),
    index('idx_tenant_role_menu').on(table.tenantId, table.menuId),
  ],
)
