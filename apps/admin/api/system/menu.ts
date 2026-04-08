import type { MenuInfo } from '@/api/menu'

export const getMenuListMethod = (page: number, pageSize: number, data?: Partial<MenuInfo>) => {
  return http.Post<RL<MenuInfo>>('/admin/system/menu', {
    page,
    pageSize,
    ...data,
  })
}

export const getMenuInfoMethod = (id: NonNullable<MenuInfo['id']>) => {
  return http.Get<R<MenuInfo>>(`/admin/system/menu/${id}`)
}
