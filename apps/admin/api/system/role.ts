import type { RoleInfo } from '@/api/role'

export const getRoleListMethod = (page: number, pageSize: number, data?: Partial<RoleInfo>) => {
  return http.Post<RL<RoleInfo>>('/admin/system/role', {
    page,
    pageSize,
    ...data,
  })
}

export const getRoleInfoMethod = (id: NonNullable<RoleInfo['id']>) => {
  return http.Get<R<RoleInfo>>(`/admin/system/role/${id}`)
}

export const saveRoleMethod = (data: Partial<RoleInfo>) => {
  return http.Post<R<RoleInfo>>('/admin/system/role/save', data)
}

export const deleteRoleMethod = (id: NonNullable<RoleInfo['id']>) => {
  return http.Post<R<Pick<RoleInfo, 'id'>>>('/admin/system/role/delete', { id })
}
