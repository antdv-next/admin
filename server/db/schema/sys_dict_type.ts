import { index, integer, pgTable, smallint, timestamp, unique, uuid, varchar } from 'drizzle-orm/pg-core'
import { v7 as uuidv7 } from 'uuid'

export const sysDictType = pgTable(
  'sys_dict_type',
  {
    // 主键 ID
    id: uuid('id').primaryKey().$defaultFn(() => uuidv7()),
    // 租户 ID，预留字段；暂不建立租户表或外键关联
    tenantId: uuid('tenant_id').notNull().default('00000000-0000-0000-0000-000000000000'),
    // 字典名称
    dictName: varchar('dict_name', { length: 64 }).notNull(),
    // 字典编码
    dictCode: varchar('dict_code', { length: 64 }).notNull(),
    // 状态 1启用 0禁用
    status: smallint('status').notNull().default(1),
    // 备注
    remark: varchar('remark', { length: 255 }),
    // 创建人
    createdBy: uuid('created_by'),
    // 更新人
    updatedBy: uuid('updated_by'),
    // 创建时间
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    // 更新时间
    updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow().$onUpdate(() => new Date()),
    // 逻辑删除
    isDeleted: smallint('is_deleted').notNull().default(0),
    // 乐观锁版本号
    version: integer('version').notNull().default(0),
  },
  table => [
    unique('uk_tenant_dict_code').on(table.tenantId, table.dictCode),
    index('idx_tenant_dict_status').on(table.tenantId, table.status),
  ],
)
