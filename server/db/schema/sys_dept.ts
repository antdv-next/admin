import { integer, pgSchema, smallint, timestamp, varchar } from 'drizzle-orm/pg-core'
import { v7 as uuidV7 } from 'uuid'

const antdvBoot = pgSchema('antdv_boot')

// 系统管理-部门表
export const sysDept = antdvBoot.table('sys_dept', {
  // 部门id
  id: varchar('id', { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidV7()),
  // 创建者id
  createId: varchar('create_id', { length: 36 }),
  // 创建者名称
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
  // 伪删除
  isDelete: varchar('is_delete', { length: 10 }).default('0'),
  // 父部门id
  parentId: varchar('parent_id', { length: 36 }),
  // 父部门路径
  parentPath: varchar('parent_path', { length: 255 }),
  // 排序
  sort: integer('sort').default(0),
  // 部门名称
  deptName: varchar('dept_name', { length: 30 }),
  // 负责人
  leaderUserId: varchar('leader_user_id', { length: 36 }),
  // 联系电话
  phone: varchar('phone', { length: 55 }),
  // 邮箱
  email: varchar('email', { length: 55 }),
  // 0正常 1禁用
  deptStatus: smallint('dept_status').default(0),
})

export type SysDept = typeof sysDept.$inferSelect
