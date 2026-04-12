import type { ConfigInfo } from '@/api/config'

export const getConfigListMethod = (page: number, pageSize: number, data?: Partial<ConfigInfo>) => {
  return http.Post<RL<ConfigInfo>>('/admin/system/config', {
    page,
    pageSize,
    ...data,
  })
}

export const getConfigInfoMethod = (id: NonNullable<ConfigInfo['id']>) => {
  return http.Get<R<ConfigInfo>>(`/admin/system/config/${id}`)
}

export const saveConfigMethod = (data: Partial<ConfigInfo>) => {
  return http.Post<R<ConfigInfo>>('/admin/system/config/save', data)
}

export const deleteConfigMethod = (id: NonNullable<ConfigInfo['id']>) => {
  return http.Post<R<Pick<ConfigInfo, 'id'>>>('/admin/system/config/delete', { id })
}
