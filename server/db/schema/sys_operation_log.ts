import { index, integer, json, pgTable, smallint, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { v7 as uuidv7 } from 'uuid'

export const sysOperationLog = pgTable(
  'sys_operation_log',
  {
    // 主键 ID
    id: uuid('id').primaryKey().$defaultFn(() => uuidv7()),
    // 租户 ID，预留字段；暂不建立租户表或外键关联
    tenantId: uuid('tenant_id').notNull().default('00000000-0000-0000-0000-000000000000'),
    // 操作用户ID
    userId: uuid('user_id'),
    // 用户名
    username: varchar('user_name', { length: 64 }),
    // 模块名称
    moduleName: varchar('module_name', { length: 64 }),
    // 业务类型：INSERT/UPDATE/DELETE/EXPORT/IMPORT/LOGIN/OTHER
    businessType: varchar('business_type', { length: 32 }),
    // 方法名
    method: varchar('method', { length: 255 }),
    // 请求方式
    requestMethod: varchar('request_method', { length: 16 }),
    // 请求URL
    requestUrl: varchar('request_url', { length: 255 }),
    // 权限标识
    permissionCode: varchar('permission_code', { length: 128 }),
    // 请求IP
    requestIp: varchar('request_ip', { length: 64 }),
    // 请求地点
    requestLocation: varchar('request_location', { length: 128 }),
    // User-Agent
    userAgent: varchar('user_agent', { length: 512 }),
    // 请求参数
    requestParams: json('request_params'),
    // 响应数据
    responseData: json('response_data'),
    // 执行耗时(毫秒)
    executionTimeMs: integer('execution_time_ms'),
    // 执行状态 1成功 0失败
    status: smallint('status').notNull().default(1),
    // 错误信息
    errorMessage: varchar('error_message', { length: 2000 }),
    // 操作时间
    operatedAt: timestamp('operated_at', { mode: 'date' }).notNull().defaultNow(),
  },
  table => [
    index('idx_tenant_user').on(table.tenantId, table.userId),
    index('idx_tenant_module').on(table.tenantId, table.moduleName),
    index('idx_tenant_status').on(table.tenantId, table.status),
    index('idx_operated_at').on(table.operatedAt),
  ],
)
