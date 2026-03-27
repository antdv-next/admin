import type { SysUser } from '#db/sys_user'

import type { MenuInfo } from '@/api/menu'

export type UserInfo = Omit<SysUser, 'password' | 'isDelete'>

export function getUserInfoApi() {
  return useGet<R<UserInfo>>('/user/info')
}

export function getUserMenuApi() {
  return useGet<R<MenuInfo[]>>('/user/menus')
}
