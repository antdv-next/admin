import { boolean, pgSchema, smallint, timestamp, varchar } from 'drizzle-orm/pg-core'
import { v7 as uuidV7 } from 'uuid'

const antdvBoot = pgSchema('antdv_boot')

export const sysRole = antdvBoot.table('sys_role', {
  // 角色ID
  id: varchar('id', { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidV7()),
  // 创建者id
  createId: varchar('create_id', { length: 36 }),
  // 创建者名称
  createName: varchar('create_name', { length: 55 }),
  // 创建时间
  createTime: timestamp('create_time', { mode: 'date', precision: 6 }),
  // 更新者id
  updateId: varchar('update_id', { length: 36 }),
  // 更新者名称
  updateName: varchar('update_name', { length: 55 }),
  // 更新时间
  updateTime: timestamp('update_time', { mode: 'date', precision: 6 }),
  // 角色编码
  code: varchar('code', { length: 100 }),
  // 伪删除（false未删除 true已删除）
  isDelete: boolean('is_delete').notNull().default(false),
  // 角色名称
  roleName: varchar('role_name', { length: 55 }),
  // 数据范围（data_scope_all：全部数据权限 data_scope_custom：自定数据权限 data_scope_self：本部门数据权限）
  dataScope: varchar('data_scope', { length: 55 }).default('data_scope_all'),
  // 角色状态（0正常 1禁用）
  roleStatus: smallint('role_status').notNull().default(0),
  // role_type_admin超级管理员 role_type_normal普通角色
  roleType: varchar('role_type', { length: 55 }).default('role_type_normal'),
  // 备注
  remark: varchar('remark', { length: 500 }),
})

export type SysRole = typeof sysRole.$inferSelect
