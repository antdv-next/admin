import type { SysUser } from '#db/sys_user'

export type UserInfo = Omit<SysUser, 'password' | 'version' | 'isDeleted'>

export function getUserInfoApi() {
  return useGet<R<UserInfo>>('/user/info')
}
