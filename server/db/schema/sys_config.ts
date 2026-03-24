import { pgTable, smallint, text, timestamp, unique, varchar } from 'drizzle-orm/pg-core'
import { v7 as uuidv7 } from 'uuid'

export const sysConfig = pgTable(
  'sys_config',
  {
    // 主键 ID
    id: varchar('id', { length: 36 })
      .primaryKey()
      .$defaultFn(() => uuidv7()),
    // 租户 ID，预留字段；暂不建立租户表或外键关联
    tenantId: varchar('tenant_id', { length: 36 })
      .notNull()
      .default('00000000-0000-0000-0000-000000000000'),
    // 配置键
    configKey: varchar('config_key', { length: 128 }).notNull(),
    // 配置值
    configValue: text('config_value'),
    // 值类型 1字符串 2数字 3布尔 4JSON
    valueType: smallint('value_type').default(1),
    // 是否系统内置
    isBuiltin: smallint('is_builtin').default(0),
    // 备注
    remark: varchar('remark', { length: 255 }),
    // 创建时间
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    // 更新时间
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [unique('uk_tenant_config_key').on(table.tenantId, table.configKey)],
)
