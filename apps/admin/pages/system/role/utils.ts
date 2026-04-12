import type { SelectProps } from 'antdv-next'
import type { RoleInfo } from '@/api/role'

export type RoleFormRecord = Omit<RoleInfo, 'roleStatus'> & {
  roleStatus: number
}

export function initFormRecord(): RoleFormRecord {
  return {
    id: '',
    createId: null,
    createName: null,
    createTime: null,
    updateId: null,
    updateName: null,
    updateTime: null,
    code: null,
    isDelete: false,
    roleName: null,
    dataScope: 'data_scope_all',
    roleStatus: 0,
    roleType: 'role_type_normal',
    remark: null,
  }
}

export function toRoleFormRecord(record?: Partial<RoleInfo> | null): RoleFormRecord {
  return {
    ...initFormRecord(),
    ...record,
    dataScope: record?.dataScope ?? 'data_scope_all',
    roleStatus: record?.roleStatus ?? 0,
    roleType: record?.roleType ?? 'role_type_normal',
  }
}

export const roleStatusOptions: SelectProps['options'] = [
  { label: '正常', value: 0 },
  { label: '禁用', value: 1 },
]

export const roleTypeOptions: SelectProps['options'] = [
  { label: '超级管理员', value: 'role_type_admin' },
  { label: '普通角色', value: 'role_type_normal' },
]

export const dataScopeOptions: SelectProps['options'] = [
  { label: '全部数据', value: 'data_scope_all' },
  { label: '自定义数据', value: 'data_scope_custom' },
  { label: '本部门数据', value: 'data_scope_self' },
]

export function getRoleStatusLabel(roleStatus?: RoleInfo['roleStatus']) {
  return roleStatusOptions?.find(item => item.value === roleStatus)?.label ?? '-'
}

export function getRoleStatusTagColor(roleStatus?: RoleInfo['roleStatus']) {
  return roleStatus === 0 ? 'success' : 'error'
}

export function getRoleTypeLabel(roleType?: RoleInfo['roleType']) {
  return roleTypeOptions?.find(item => item.value === roleType)?.label ?? '-'
}

export function getDataScopeLabel(dataScope?: RoleInfo['dataScope']) {
  return dataScopeOptions?.find(item => item.value === dataScope)?.label ?? '-'
}
