import {
  index,
  integer,
  pgTable,
  smallint,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core'
import { v7 as uuidv7 } from 'uuid'

export const sysRole = pgTable(
  'sys_role',
  {
    // 主键 ID
    id: varchar('id', { length: 36 })
      .primaryKey()
      .$defaultFn(() => uuidv7()),
    // 租户 ID，预留字段；暂不建立租户表或外键关联
    tenantId: varchar('tenant_id', { length: 36 })
      .notNull()
      .default('00000000-0000-0000-0000-000000000000'),
    // 角色名称
    roleName: varchar('role_name', { length: 64 }).notNull(),
    // 角色编码
    roleCode: varchar('role_code', { length: 64 }).notNull(),
    // 状态：1 启用，0 禁用
    status: smallint('status').notNull().default(1),
    // 排序
    sort: integer('sort').notNull().default(0),
    // 是否系统内置角色：1 是，0 否
    isSystem: smallint('is_system').notNull().default(0),
    // 备注
    remark: varchar('remark', { length: 255 }),
    // 创建人
    createdBy: varchar('created_by', { length: 36 }),
    // 创建人名称
    createdByName: varchar('created_by_name', { length: 64 }),
    // 更新人
    updatedBy: varchar('updated_by', { length: 36 }),
    // 更新人名称
    updatedByName: varchar('updated_by_name', { length: 64 }),
    // 创建时间
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    // 更新时间
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
    // 逻辑删除：1 已删除，0 未删除
    isDeleted: smallint('is_deleted').notNull().default(0),
    // 乐观锁版本号
    version: integer('version').notNull().default(0),
  },
  (table) => [
    // 针对某个租户唯一的角色编码，支持未来多租户场景
    uniqueIndex('uk_tenant_role_code').on(table.tenantId, table.roleCode),
    // 按租户和状态筛选角色
    index('idx_tenant_role_status').on(table.tenantId, table.status),
  ],
)

export type SysRole = typeof sysRole.$inferSelect
export type NewSysRole = typeof sysRole.$inferInsert
