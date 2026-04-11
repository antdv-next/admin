import { pgSchema, varchar } from 'drizzle-orm/pg-core'
import { v7 as uuidV7 } from 'uuid'

const antdvBoot = pgSchema('antdv_boot')

// 系统管理-用户角色表
export const sysUserRoleRel = antdvBoot.table('sys_user_role_rel', {
  // id
  id: varchar('id', { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidV7()),
  // 用户id
  userId: varchar('user_id', { length: 36 }),
  // 角色id
  roleId: varchar('role_id', { length: 36 }),
})

export type SysUserRoleRel = typeof sysUserRoleRel.$inferSelect
