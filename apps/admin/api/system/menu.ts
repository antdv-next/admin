import type { MenuInfo } from '@/api/menu'

export type MenuParentOption = Pick<MenuInfo, 'id' | 'menuType' | 'parentId' | 'sort' | 'title'>
export type DeleteMenuPayload = Pick<MenuInfo, 'id'>

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

export const getMenuParentOptionsMethod = () => {
  return http.Get<R<MenuParentOption[]>>('/admin/system/menu/parent-options')
}

export const saveMenuMethod = (data: Partial<MenuInfo>) => {
  return http.Post<R<MenuInfo>>('/admin/system/menu/save', data)
}

export const deleteMenuMethod = (id: NonNullable<MenuInfo['id']>) => {
  return http.Post<R<DeleteMenuPayload>>('/admin/system/menu/delete', { id })
}
