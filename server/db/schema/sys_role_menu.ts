import { index, pgTable, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core'
import { v7 as uuidv7 } from 'uuid'

export const sysRoleMenu = pgTable(
  'sys_role_menu',
  {
    // 主键id
    id: uuid('id').primaryKey().$defaultFn(() => uuidv7()),
    // 租户 ID，预留字段；暂不建立租户表或外键关联
    tenantId: uuid('tenant_id').notNull().default('00000000-0000-0000-0000-000000000000'),
    // 角色ID
    roleId: uuid('role_id').notNull(),
    // 菜单ID
    menuId: uuid('menu_id').notNull(),
    // 创建时间
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  },
  table => [
    uniqueIndex('uk_tenant_role_menu').on(table.tenantId, table.roleId, table.menuId),
    index('idx_tenant_menu').on(table.tenantId, table.menuId),
  ],
)
