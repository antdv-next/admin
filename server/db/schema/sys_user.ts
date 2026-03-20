import { index, integer, pgTable, smallint, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core'
import { v7 as uuidv7 } from 'uuid'

export const sysUser = pgTable(
  'sys_user',
  {
    // 主键 ID
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => uuidv7()),
    // 租户 ID，预留字段；暂不建立租户表或外键关联
    tenantId: varchar('tenant_id', { length: 36 }).notNull().default('00000000-0000-0000-0000-000000000000'),
    // 部门id，用户的主部门，这个也是冗余字段，暂不使用
    deptId: varchar('dept_id', { length: 36 }).notNull().default('00000000-0000-0000-0000-000000000000'),
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
    updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow().$onUpdateFn(() => new Date()),
    // 逻辑删除：1 已删除，0 未删除
    isDeleted: smallint('is_deleted').notNull().default(0),
    // 乐观锁版本号
    version: integer('version').notNull().default(0),
  },
  table => [
    // 针对某个租户唯一的用户名，支持未来多租户场景
    uniqueIndex('uk_tenant_user_username').on(table.tenantId, table.username),
    index('idx_tenant_user_status').on(table.tenantId, table.status),
    index('idx_tenant_user_dept').on(table.tenantId, table.deptId),
  ],
)

export type SysUser = typeof sysUser.$inferSelect
