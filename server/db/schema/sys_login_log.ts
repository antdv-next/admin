import { index, pgTable, smallint, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { v7 as uuidv7 } from 'uuid'

export const sysLoginLog = pgTable(
  'sys_login_log',
  {
  // 主键 ID
    id: uuid('id').primaryKey().$defaultFn(() => uuidv7()),
    // 租户 ID，预留字段；暂不建立租户表或外键关联
    tenantId: uuid('tenant_id').notNull().default('00000000-0000-0000-0000-000000000000'),
    // 用户ID
    userId: uuid('user_id'),
    // 登录用户名
    username: varchar('user_name', { length: 64 }),
    // 登录类型 1 PC 2 移动端 3 其他 后续再扩展
    loginType: smallint('login_type').notNull().default(1),
    // 登录IP
    loginIp: varchar('login_ip', { length: 64 }),
    // 登录的地点
    loginLocation: varchar('login_location', { length: 128 }),
    // UA
    userAgent: varchar('user_agent', { length: 512 }),
    // 浏览器
    browser: varchar('browser', { length: 128 }),
    // 登录系统
    os: varchar('os', { length: 128 }),
    // 设备信息
    device: varchar('device', { length: 128 }),
    // 登录结果 1成功 0失败
    status: smallint('status').notNull().default(1),
    // 错误原因
    failReason: varchar('fail_reason', { length: 255 }),
    // 登录时间
    loginAt: timestamp('login_at', { mode: 'date' }).notNull().defaultNow(),
  },
  table => [
    index('idx_tenant_user').on(table.tenantId, table.userId),
    index('idx_tenant_status').on(table.tenantId, table.status),
    index('idx_login_at').on(table.loginAt),
  ],
)
