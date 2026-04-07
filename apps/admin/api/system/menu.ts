import type { MenuInfo } from '@/api/menu'

export interface MenuParams {}

export const getMenuListMethod = (data?: MenuParams) => {
  return http.Post<RL<MenuInfo>>('/admin/system/menu', data)
}
