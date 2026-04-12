import type { DictInfo } from '@/api/dict'

export type DictParentOption = Pick<DictInfo, 'id' | 'label' | 'parentId' | 'sort'>

export const getDictListMethod = (page: number, pageSize: number, data?: Partial<DictInfo>) => {
  return http.Post<RL<DictInfo>>('/admin/system/dict', {
    page,
    pageSize,
    ...data,
  })
}

export const getDictInfoMethod = (id: NonNullable<DictInfo['id']>) => {
  return http.Get<R<DictInfo>>(`/admin/system/dict/${id}`)
}

export const getDictParentOptionsMethod = () => {
  return http.Get<R<DictParentOption[]>>('/admin/system/dict/parent-options')
}

export const saveDictMethod = (data: Partial<DictInfo>) => {
  return http.Post<R<DictInfo>>('/admin/system/dict/save', data)
}

export const deleteDictMethod = (id: NonNullable<DictInfo['id']>) => {
  return http.Post<R<Pick<DictInfo, 'id'>>>('/admin/system/dict/delete', { id })
}
