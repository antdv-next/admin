import { bigint, pgSchema, smallint, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { v7 as uuidV7 } from 'uuid'

const antdvBoot = pgSchema('antdv_boot')

// 系统管理-字典表（层级结构，父节点为字典分类，子节点为字典项）
export const sysDict = antdvBoot.table('sys_dict', {
  // id
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
  // 编码
  code: varchar('code', { length: 100 }),
  // 伪删除
  isDelete: varchar('is_delete', { length: 10 }).default('0'),
  // 父id
  parentId: varchar('parent_id', { length: 36 }),
  // 父路径
  parentPath: varchar('parent_path', { length: 255 }),
  // 排序
  sort: bigint('sort', { mode: 'number' }).default(0),
  // 标签
  label: varchar('label', { length: 100 }),
  // 值
  value: varchar('value', { length: 100 }),
  // 状态0开启 1禁用
  dictStatus: smallint('dict_status').default(0),
  // 备注
  remark: varchar('remark', { length: 255 }),
  // dict_source_enum枚举 dict_source_custom自定义
  dictSource: varchar('dict_source', { length: 55 }).default('dict_source_custom'),
  // 扩展json串
  expand: text('expand'),
})

export type SysDict = typeof sysDict.$inferSelect
