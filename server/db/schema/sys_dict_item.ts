import { index, integer, pgTable, smallint, timestamp, unique, uuid, varchar } from 'drizzle-orm/pg-core'
import { v7 as uuidv7 } from 'uuid'

export const sysDictItem = pgTable(
  'sys_dict_item',
  {
    // 主键 ID
    id: uuid('id').primaryKey().$defaultFn(() => uuidv7()),
    // 租户 ID，预留字段；暂不建立租户表或外键关联
    tenantId: uuid('tenant_id').notNull().default('00000000-0000-0000-0000-000000000000'),
    // 字典类型ID
    dictTypeId: uuid('dict_type_id').notNull(),
    // 字典标签
    label: varchar('label', { length: 64 }).notNull(),
    // 字典值
    value: varchar('value', { length: 64 }).notNull(),
    // 标签类型，如 success/info/warning/danger
    tagType: varchar('tag_type', { length: 32 }),
    // 样式类名
    cssClass: varchar('css_class', { length: 64 }),
    // 排序
    sort: integer('sort').notNull().default(0),
    // 是否默认项 1是 0否
    isDefault: smallint('is_default').notNull().default(0),
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
    unique('uk_tenant_dict_type_value').on(table.tenantId, table.dictTypeId, table.value),
    index('idx_tenant_dict_type').on(table.tenantId, table.dictTypeId),
    index('idx_tenant_status').on(table.tenantId, table.status),
  ],
)
