import type { SelectProps } from 'antdv-next'
import type { UserRecord } from '@/api/user'

export type UserFormRecord = Omit<UserRecord, 'editFirstPassword' | 'userStatus'> & {
  editFirstPassword: number
  userStatus: number
}

export function initFormRecord(): UserFormRecord {
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
    nickname: null,
    username: null,
    password: null,
    lastEditPasswordTime: null,
    editFirstPassword: 0,
    userSex: null,
    realName: null,
    idNum: null,
    avatarFileId: null,
    userEmail: null,
    userPhone: null,
    userStatus: 0,
    loginLockInfo: null,
    periodOfValidity: null,
    userSource: 'user_source_system',
    webTheme: null,
  }
}

export function toUserFormRecord(record?: Partial<UserRecord> | null): UserFormRecord {
  return {
    ...initFormRecord(),
    ...record,
    editFirstPassword: record?.editFirstPassword ?? 0,
    userSource: record?.userSource ?? 'user_source_system',
    userStatus: record?.userStatus ?? 0,
  }
}

export const userStatusOptions: SelectProps['options'] = [
  { label: '正常', value: 0 },
  { label: '禁用', value: 1 },
]

export const userSexOptions: SelectProps['options'] = [
  { label: '男', value: 'user_sex_man' },
  { label: '女', value: 'user_sex_woman' },
]

export function getUserStatusLabel(userStatus?: UserRecord['userStatus']) {
  return userStatusOptions?.find(item => item.value === userStatus)?.label ?? '-'
}

export function getUserStatusTagColor(userStatus?: UserRecord['userStatus']) {
  return userStatus === 0 ? 'success' : 'error'
}

export function getUserSexLabel(userSex?: UserRecord['userSex']) {
  return userSexOptions?.find(item => item.value === userSex)?.label ?? '-'
}
