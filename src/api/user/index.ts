import type { SysUser } from '#db/sys_user'

export type UserInfo = Omit<SysUser, 'password' | 'version' | 'isDeleted'>
