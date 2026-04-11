import { boolean, pgSchema, smallint, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { v7 as uuidV7 } from 'uuid'

const antdvBoot = pgSchema('antdv_boot')

export const sysUser = antdvBoot.table('sys_user', {
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
  // 编号
  code: varchar('code', { length: 55 }),
  // 是否删除/软删除，false不删除，true删除
  isDelete: boolean('is_delete').notNull().default(false),
  // 用户昵称
  nickname: varchar('nickname', { length: 55 }),
  // 用户名称
  username: varchar('username', { length: 55 }),
  // 密码
  password: varchar('password', { length: 155 }),
  // 最后修改密码时间
  lastEditPasswordTime: timestamp('last_edit_password_time', { mode: 'date', precision: 6 }),
  // 0未修改 1已修改
  editFirstPassword: smallint('edit_first_password').default(0),
  // user_sex_man男 user_sex_woman女
  userSex: varchar('user_sex', { length: 55 }),
  // 真实名称
  realName: varchar('real_name', { length: 55 }),
  // 身份证
  idNum: varchar('id_num', { length: 55 }),
  // 头像文件id
  avatarFileId: varchar('avatar_file_id', { length: 36 }),
  // 用户邮箱
  userEmail: varchar('user_email', { length: 55 }),
  // 用户手机号
  userPhone: varchar('user_phone', { length: 55 }),
  // 0正常 1禁用
  userStatus: smallint('user_status').default(0),
  // 是否锁定+锁定ip+解锁时间
  loginLockInfo: text('login_lock_info'),
  // 用户有效期
  periodOfValidity: timestamp('period_of_validity', { mode: 'date', precision: 6 }),
  // 用户来源，user_source_system系统创建 user_source_register自主注册
  userSource: varchar('user_source', { length: 55 }).default('user_source_system'),
  // 主题
  webTheme: varchar('web_theme', { length: 55 }),
})

export type SysUser = typeof sysUser.$inferSelect
