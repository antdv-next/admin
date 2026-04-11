import { boolean, pgSchema, timestamp, varchar } from 'drizzle-orm/pg-core'
import { v7 as uuidV7 } from 'uuid'

const antdvBoot = pgSchema('antdv_boot')

export const sysConfig = antdvBoot.table('sys_config', {
  // 主键
  id: varchar('id', { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidV7()),
  // 创建人id
  createId: varchar('create_id', { length: 36 }),
  // 创建人名称
  createName: varchar('create_name', { length: 55 }),
  // 创建时间
  createTime: timestamp('create_time', { mode: 'date', precision: 6 }),
  // 更新人id
  updateId: varchar('update_id', { length: 36 }),
  // 更新人名称
  updateName: varchar('update_name', { length: 55 }),
  // 更新时间
  updateTime: timestamp('update_time', { mode: 'date', precision: 6 }),
  // 编号
  code: varchar('code', { length: 55 }),
  // 伪删除（false未删除 true已删除）
  isDelete: boolean('is_delete').notNull().default(false),
  // 配置分类，字典值
  configType: varchar('config_type', { length: 55 }),
  // 配置名称
  configName: varchar('config_name', { length: 55 }),
  // 配置键
  configKey: varchar('config_key', { length: 55 }),
  // 配置值
  configValue: varchar('config_value', { length: 255 }),
  // 配置来源，config_source_system系统默认 config_source_custom自定义
  configSource: varchar('config_source', { length: 55 }),
  // 配置备注
  sourceRemark: varchar('source_remark', { length: 255 }),
})

export type SysConfig = typeof sysConfig.$inferSelect
