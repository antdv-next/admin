import type { SysUser } from '#db/user'

export type UserInfo = Omit<SysUser, 'password' | 'version' | 'isDeleted'>
