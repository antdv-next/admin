import { boolean, pgSchema, varchar } from 'drizzle-orm/pg-core'
import { v7 as uuidV7 } from 'uuid'

const antdvBoot = pgSchema('antdv_boot')

// 系统管理-用户部门关系表
export const sysUserDeptRel = antdvBoot.table('sys_user_dept_rel', {
  // id
  id: varchar('id', { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidV7()),
  // 用户id
  userId: varchar('user_id', { length: 36 }),
  // 部门id
  deptId: varchar('dept_id', { length: 36 }),
  // 是否主部门（false非主部门 true主部门）
  mainDept: boolean('main_dept').notNull().default(false),
})

export type SysUserDeptRel = typeof sysUserDeptRel.$inferSelect
