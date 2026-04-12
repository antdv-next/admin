import type { SysUser } from '#db/sys_user'
import { defineMock, response } from '../../index'
import { cloneSysUserSeeds } from './seeds/user'

type UserListPayload = {
  nickname?: string
  page?: number
  pageSize?: number
  realName?: string
  userPhone?: string
  userStatus?: number
  username?: string
}

const userStore = cloneSysUserSeeds()

export default defineMock({
  '[POST]/admin/system/user'({ data }) {
    const payload = normalizePayload(data)
    const filteredItems = queryUsers(payload)
    const total = filteredItems.length
    const page = normalizePage(payload.page)
    const pageSize = normalizePageSize(payload.pageSize)
    const start = (page - 1) * pageSize
    const list = filteredItems.slice(start, start + pageSize)

    return response({
      code: 200,
      msg: 'success',
      data: { list, total },
    })
  },
  '[GET]/admin/system/user/{id}'({ params }) {
    const item = findUserById(params.id)

    return response({
      code: 200,
      msg: 'success',
      data: item ? cloneUser(item) : null,
    })
  },
  '[POST]/admin/system/user/save'({ data }) {
    return response({
      code: 200,
      msg: 'success',
      data: saveUser(data),
    })
  },
  '[POST]/admin/system/user/delete'({ data }) {
    return response({
      code: 200,
      msg: 'success',
      data: deleteUser(data),
    })
  },
})

function queryUsers(query: UserListPayload) {
  return getActiveUsers()
    .filter(item => {
      if (query.nickname && !includesIgnoreCase(item.nickname, query.nickname)) {
        return false
      }
      if (query.realName && !includesIgnoreCase(item.realName, query.realName)) {
        return false
      }
      if (query.userPhone && !includesIgnoreCase(item.userPhone, query.userPhone)) {
        return false
      }
      if (typeof query.userStatus === 'number' && item.userStatus !== query.userStatus) {
        return false
      }
      if (query.username && !includesIgnoreCase(item.username, query.username)) {
        return false
      }
      return true
    })
    .sort((left, right) => String(left.id).localeCompare(String(right.id)))
    .map(cloneUser)
}

function getActiveUsers() {
  return userStore.filter(item => !item.isDelete)
}

function findUserById(id: unknown) {
  return getActiveUsers().find(item => item.id === String(id))
}

function saveUser(data: unknown) {
  const payload = normalizeRecord<SysUser>(data)
  const now = new Date()
  const existingItem = payload.id ? findUserById(payload.id) : undefined

  if (existingItem) {
    Object.assign(existingItem, {
      ...payload,
      id: existingItem.id,
      password: existingItem.password,
      updateTime: now,
    })
    return cloneUser(existingItem)
  }

  const created: SysUser = {
    id: payload.id || `user-${Date.now()}`,
    createId: 'mock-system-admin',
    createName: 'Mock System Admin',
    createTime: now,
    updateId: 'mock-system-admin',
    updateName: 'Mock System Admin',
    updateTime: now,
    code: payload.code ?? payload.username ?? null,
    isDelete: false,
    nickname: payload.nickname ?? null,
    username: payload.username ?? null,
    password: payload.password ?? '123456',
    lastEditPasswordTime: null,
    editFirstPassword: 0,
    userSex: payload.userSex ?? null,
    realName: payload.realName ?? null,
    idNum: payload.idNum ?? null,
    avatarFileId: payload.avatarFileId ?? null,
    userEmail: payload.userEmail ?? null,
    userPhone: payload.userPhone ?? null,
    userStatus: payload.userStatus ?? 0,
    loginLockInfo: null,
    periodOfValidity: payload.periodOfValidity ?? null,
    userSource: payload.userSource ?? 'user_source_system',
    webTheme: payload.webTheme ?? null,
  }
  userStore.push(created)
  return cloneUser(created)
}

function deleteUser(data: unknown) {
  const id = normalizeId(data)
  const index = userStore.findIndex(item => item.id === id)
  if (index >= 0) {
    userStore.splice(index, 1)
  }
  return { id }
}

function normalizePayload(data: unknown): UserListPayload {
  if (typeof data !== 'object' || data === null) {
    return {}
  }
  const payload = data as Record<string, unknown>
  return {
    nickname: toStringValue(payload.nickname),
    page: toNumber(payload.page),
    pageSize: toNumber(payload.pageSize),
    realName: toStringValue(payload.realName),
    userPhone: toStringValue(payload.userPhone),
    userStatus: toNumber(payload.userStatus),
    username: toStringValue(payload.username),
  }
}

function normalizeRecord<T>(data: unknown) {
  if (typeof data !== 'object' || data === null) {
    return {} as Partial<T>
  }
  return { ...(data as Record<string, unknown>) } as Partial<T>
}

function normalizeId(data: unknown) {
  if (typeof data === 'string' || typeof data === 'number') {
    return String(data)
  }
  if (typeof data === 'object' && data !== null && 'id' in data) {
    return String((data as { id?: unknown }).id ?? '')
  }
  return ''
}

function toNumber(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : undefined
  }
  return undefined
}

function toStringValue(value: unknown) {
  return typeof value === 'string' && value !== '' ? value : undefined
}

function normalizePage(page: number | undefined) {
  return page && page > 0 ? Math.floor(page) : 1
}

function normalizePageSize(pageSize: number | undefined) {
  return pageSize && pageSize > 0 ? Math.floor(pageSize) : 10
}

function includesIgnoreCase(value: string | null | undefined, keyword: string) {
  return value?.toLowerCase().includes(keyword.toLowerCase()) ?? false
}

function cloneUser(item: SysUser): SysUser {
  return {
    ...item,
    createTime: item.createTime ? new Date(item.createTime) : null,
    updateTime: item.updateTime ? new Date(item.updateTime) : null,
    lastEditPasswordTime: item.lastEditPasswordTime ? new Date(item.lastEditPasswordTime) : null,
    periodOfValidity: item.periodOfValidity ? new Date(item.periodOfValidity) : null,
  }
}
