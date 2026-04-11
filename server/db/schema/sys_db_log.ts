import { bigint, integer, pgSchema, smallint, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { v7 as uuidV7 } from 'uuid'

const antdvBoot = pgSchema('antdv_boot')

// 基础建设-数据库日志表
export const sysDbLog = antdvBoot.table('sys_db_log', {
  // id
  id: varchar('id', { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidV7()),
  // 应用名称
  applicationName: varchar('application_name', { length: 55 }),
  // 当前环境标
  currentEnvironment: varchar('current_environment', { length: 55 }),
  // 请求的客户端ip
  clientIp: varchar('client_ip', { length: 55 }),
  // 执行的服务端ip
  serverIp: varchar('server_ip', { length: 55 }),
  // 用户id
  userId: varchar('user_id', { length: 36 }),
  // 请求的url
  requestUrl: varchar('request_url', { length: 125 }),
  // sql方法
  sqlMethod: varchar('sql_method', { length: 125 }),
  // 执行耗时，毫秒
  consumeTime: bigint('consume_time', { mode: 'number' }),
  // 预执行sql
  preSql: text('pre_sql'),
  // 实际执行sql
  realSql: text('real_sql'),
  // sql类型
  sqlType: varchar('sql_type', { length: 20 }),
  // sql涉及的表名
  tableNames: varchar('table_names', { length: 125 }),
  // 数据结果条数
  dataCount: integer('data_count'),
  // 查询数据
  data: text('data'),
  // 是否读取缓存
  readCache: smallint('read_cache'),
  // 读取缓存的key
  cacheKey: varchar('cache_key', { length: 55 }),
  // 执行日期
  executionDate: timestamp('execution_date', { mode: 'date', precision: 6 }),
})

export type SysDbLog = typeof sysDbLog.$inferSelect
