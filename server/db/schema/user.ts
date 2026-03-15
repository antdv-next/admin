import { integer, pgTable, smallint, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core'
import { v7 as uuidv7 } from 'uuid'

export const sysUser = pgTable(
  'sys_user',
  {
    id: uuid('id').primaryKey().$defaultFn(() => uuidv7()),
    // Reserved for future multi-tenant support. No tenant table/foreign key for now.
    tenantId: uuid('tenant_id').notNull().default('00000000-0000-0000-0000-000000000000'),
    username: varchar('username', { length: 64 }).notNull(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    nickname: varchar('nickname', { length: 64 }),
    realName: varchar('real_name', { length: 64 }),
    email: varchar('email', { length: 128 }),
    phone: varchar('phone', { length: 32 }),
    avatar: varchar('avatar', { length: 255 }),
    gender: smallint('gender').default(0),
    status: smallint('status').notNull().default(1),
    isSuperAdmin: smallint('is_super_admin').notNull().default(0),
    lastLoginIp: varchar('last_login_ip', { length: 64 }),
    lastLoginAt: timestamp('last_login_at', { mode: 'date' }),
    remark: varchar('remark', { length: 255 }),
    createdBy: uuid('created_by'),
    updatedBy: uuid('updated_by'),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow().$onUpdateFn(() => new Date()),
    isDeleted: smallint('is_deleted').notNull().default(0),
    version: integer('version').notNull().default(0),
  },
  table => [
    // 针对某个租户唯一的用户名，支持未来多租户场景
    uniqueIndex('uk_tenant_username').on(table.tenantId, table.username),
  ],
)

export type SysUser = typeof sysUser.$inferSelect
export type NewSysUser = typeof sysUser.$inferInsert
