import { bigint, index, pgSchema, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { v7 as uuidV7 } from 'uuid'

const antdvBoot = pgSchema('antdv_boot')

export const sysOperationLog = antdvBoot.table(
  'sys_operation_log',
  {
    // id
    id: varchar('id', { length: 36 })
      .primaryKey()
      .$defaultFn(() => uuidV7()),
    // 操作用户id
    operationId: varchar('operation_id', { length: 36 }),
    // 操作用户姓名
    operationName: varchar('operation_name', { length: 55 }),
    // 登录系统昵称
    operationNickname: varchar('operation_nickname', { length: 55 }),
    // 操作者的IP地址
    operationIp: varchar('operation_ip', { length: 20 }),
    // 方法名称
    methodName: varchar('method_name', { length: 100 }),
    // 全路径方法名称
    fullMethodName: varchar('full_method_name', { length: 255 }),
    // 请求方式
    requestMethod: varchar('request_method', { length: 55 }),
    // 方法路径
    methodUrl: varchar('method_url', { length: 255 }),
    // 方法描述
    methodDesc: varchar('method_desc', { length: 555 }),
    // 请求参数
    requestParameters: text('request_parameters'),
    // 执行结果
    executionResult: varchar('execution_result', { length: 50 }),
    // 执行耗时
    executionTime: bigint('execution_time', { mode: 'number' }),
    // 错误原因
    cause: text('cause'),
    // 操作时间
    operationTime: timestamp('operation_time', { mode: 'date', precision: 6 }),
    // 环境标
    environment: varchar('environment', { length: 20 }),
  },
  table => [
    index('idx_sys_operation_log_method_name').on(table.methodName),
    index('idx_sys_operation_log_operation_id').on(table.operationId),
    index('idx_sys_operation_log_operation_time').on(table.operationTime),
  ],
)

export type SysOperationLog = typeof sysOperationLog.$inferSelect
