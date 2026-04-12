import type { SysUser } from '#db/sys_user'
import type { MenuInfo } from '@/api/menu'
import { http } from '@/utils/request'

export type UserInfo = Omit<SysUser, 'password' | 'isDelete'>
export type UserRecord = SysUser

export function getUserInfoMethod() {
  return http.Get<R<UserInfo>>('/user/info')
}

export function getUserMenuMethod() {
  return http.Get<R<MenuInfo[]>>('/user/menus')
}
