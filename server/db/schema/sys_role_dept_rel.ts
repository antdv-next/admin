import { pgSchema, varchar } from 'drizzle-orm/pg-core'
import { v7 as uuidV7 } from 'uuid'

const antdvBoot = pgSchema('antdv_boot')

// 系统管理-角色部门关系表
export const sysRoleDeptRel = antdvBoot.table('sys_role_dept_rel', {
  // id
  id: varchar('id', { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidV7()),
  // 角色id
  roleId: varchar('role_id', { length: 36 }),
  // 部门id
  deptId: varchar('dept_id', { length: 36 }),
})

export type SysRoleDeptRel = typeof sysRoleDeptRel.$inferSelect
