import { integer, pgTable, smallint, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core'
import { v7 as uuidv7 } from 'uuid'

export const sysUser = pgTable(
  'sys_user',
  {
    // 主键 ID
    id: uuid('id').primaryKey().$defaultFn(() => uuidv7()),
    // 租户 ID，预留字段；暂不建立租户表或外键关联
    tenantId: uuid('tenant_id').notNull().default('00000000-0000-0000-0000-000000000000'),
    // 用户名
    username: varchar('username', { length: 64 }).notNull(),
    // 密码哈希
    password: varchar('password', { length: 255 }).notNull(),
    // 昵称
    nickname: varchar('nickname', { length: 64 }),
    // 真实姓名
    realName: varchar('real_name', { length: 64 }),
    // 邮箱
    email: varchar('email', { length: 128 }),
    // 手机号
    phone: varchar('phone', { length: 32 }),
    // 头像
    avatar: varchar('avatar', { length: 255 }),
    // 性别：0 未知，1 男，2 女
    gender: smallint('gender').default(0),
    // 状态：1 启用，0 禁用
    status: smallint('status').notNull().default(1),
    // 是否超级管理员：1 是，0 否
    isSuperAdmin: smallint('is_super_admin').notNull().default(0),
    // 最后登录 IP
    lastLoginIp: varchar('last_login_ip', { length: 64 }),
    // 最后登录时间
    lastLoginAt: timestamp('last_login_at', { mode: 'date' }),
    // 备注
    remark: varchar('remark', { length: 255 }),
    // 创建人
    createdBy: uuid('created_by'),
    // 更新人
    updatedBy: uuid('updated_by'),
    // 创建时间
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    // 更新时间
    updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow().$onUpdateFn(() => new Date()),
    // 逻辑删除：1 已删除，0 未删除
    isDeleted: smallint('is_deleted').notNull().default(0),
    // 乐观锁版本号
    version: integer('version').notNull().default(0),
  },
  table => [
    // 针对某个租户唯一的用户名，支持未来多租户场景
    uniqueIndex('uk_tenant_username').on(table.tenantId, table.username),
  ],
)

export type SysUser = typeof sysUser.$inferSelect
export type NewSysUser = typeof sysUser.$inferInsert
