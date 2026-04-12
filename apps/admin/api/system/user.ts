import type { UserRecord } from '@/api/user'

export const getUserListMethod = (page: number, pageSize: number, data?: Partial<UserRecord>) => {
  return http.Post<RL<UserRecord>>('/admin/system/user', {
    page,
    pageSize,
    ...data,
  })
}

export const getUserRecordMethod = (id: NonNullable<UserRecord['id']>) => {
  return http.Get<R<UserRecord>>(`/admin/system/user/${id}`)
}

export const saveUserRecordMethod = (data: Partial<UserRecord>) => {
  return http.Post<R<UserRecord>>('/admin/system/user/save', data)
}

export const deleteUserRecordMethod = (id: NonNullable<UserRecord['id']>) => {
  return http.Post<R<Pick<UserRecord, 'id'>>>('/admin/system/user/delete', { id })
}
