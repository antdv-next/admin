import type { SelectProps } from 'antdv-next'
import type { DictInfo } from '@/api/dict'

export type DictFormRecord = Omit<DictInfo, 'dictStatus' | 'sort'> & {
  dictStatus: number
  sort: number
}

export function initFormRecord(): DictFormRecord {
  return {
    id: '',
    createId: null,
    createName: null,
    createTime: null,
    updateId: null,
    updateName: null,
    updateTime: null,
    code: null,
    isDelete: '0',
    parentId: null,
    parentPath: null,
    sort: 0,
    label: null,
    value: null,
    dictStatus: 0,
    remark: null,
    dictSource: 'dict_source_custom',
    expand: null,
  }
}

export function toDictFormRecord(record?: Partial<DictInfo> | null): DictFormRecord {
  return {
    ...initFormRecord(),
    ...record,
    dictSource: record?.dictSource ?? 'dict_source_custom',
    dictStatus: record?.dictStatus ?? 0,
    sort: record?.sort ?? 0,
  }
}

export const dictStatusOptions: SelectProps['options'] = [
  { label: '正常', value: 0 },
  { label: '禁用', value: 1 },
]

export const dictSourceOptions: SelectProps['options'] = [
  { label: '枚举', value: 'dict_source_enum' },
  { label: '自定义', value: 'dict_source_custom' },
]

export function getDictStatusLabel(dictStatus?: DictInfo['dictStatus']) {
  return dictStatusOptions?.find(item => item.value === dictStatus)?.label ?? '-'
}

export function getDictStatusTagColor(dictStatus?: DictInfo['dictStatus']) {
  return dictStatus === 0 ? 'success' : 'error'
}

export function getDictSourceLabel(dictSource?: DictInfo['dictSource']) {
  return dictSourceOptions?.find(item => item.value === dictSource)?.label ?? '-'
}
