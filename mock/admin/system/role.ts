import type { SysRole } from '#db/sys_role'
import { defineMock, response } from '../../index'
import { cloneSysRoleSeeds } from './seeds/role'

type RoleListPayload = {
  code?: string
  page?: number
  pageSize?: number
  roleName?: string
  roleStatus?: number
  roleType?: string
}

const roleStore = cloneSysRoleSeeds()

export default defineMock({
  '[POST]/admin/system/role'({ data }) {
    const payload = normalizePayload(data)
    const filteredItems = queryRoles(payload)
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
  '[GET]/admin/system/role/{id}'({ params }) {
    const item = findRoleById(params.id)

    return response({
      code: 200,
      msg: 'success',
      data: item ? cloneRole(item) : null,
    })
  },
  '[POST]/admin/system/role/save'({ data }) {
    return response({
      code: 200,
      msg: 'success',
      data: saveRole(data),
    })
  },
  '[POST]/admin/system/role/delete'({ data }) {
    return response({
      code: 200,
      msg: 'success',
      data: deleteRole(data),
    })
  },
})

function queryRoles(query: RoleListPayload) {
  return getActiveRoles()
    .filter(item => {
      if (query.code && !includesIgnoreCase(item.code, query.code)) {
        return false
      }
      if (query.roleName && !includesIgnoreCase(item.roleName, query.roleName)) {
        return false
      }
      if (typeof query.roleStatus === 'number' && item.roleStatus !== query.roleStatus) {
        return false
      }
      if (query.roleType && item.roleType !== query.roleType) {
        return false
      }
      return true
    })
    .sort((left, right) => String(left.id).localeCompare(String(right.id)))
    .map(cloneRole)
}

function getActiveRoles() {
  return roleStore.filter(item => !item.isDelete)
}

function findRoleById(id: unknown) {
  return getActiveRoles().find(item => item.id === String(id))
}

function saveRole(data: unknown) {
  const payload = normalizeRecord<SysRole>(data)
  const now = new Date()
  const existingItem = payload.id ? findRoleById(payload.id) : undefined

  if (existingItem) {
    Object.assign(existingItem, {
      ...payload,
      id: existingItem.id,
      updateTime: now,
    })
    return cloneRole(existingItem)
  }

  const created: SysRole = {
    id: payload.id || `role-${Date.now()}`,
    createId: 'mock-system-admin',
    createName: 'Mock System Admin',
    createTime: now,
    updateId: 'mock-system-admin',
    updateName: 'Mock System Admin',
    updateTime: now,
    code: payload.code ?? null,
    isDelete: false,
    roleName: payload.roleName ?? null,
    dataScope: payload.dataScope ?? 'data_scope_all',
    roleStatus: payload.roleStatus ?? 0,
    roleType: payload.roleType ?? 'role_type_normal',
    remark: payload.remark ?? null,
  }
  roleStore.push(created)
  return cloneRole(created)
}

function deleteRole(data: unknown) {
  const id = normalizeId(data)
  const index = roleStore.findIndex(item => item.id === id)
  if (index >= 0) {
    roleStore.splice(index, 1)
  }
  return { id }
}

function normalizePayload(data: unknown): RoleListPayload {
  if (typeof data !== 'object' || data === null) {
    return {}
  }
  const payload = data as Record<string, unknown>
  return {
    code: toStringValue(payload.code),
    page: toNumber(payload.page),
    pageSize: toNumber(payload.pageSize),
    roleName: toStringValue(payload.roleName),
    roleStatus: toNumber(payload.roleStatus),
    roleType: toStringValue(payload.roleType),
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

function cloneRole(item: SysRole): SysRole {
  return {
    ...item,
    createTime: item.createTime ? new Date(item.createTime) : null,
    updateTime: item.updateTime ? new Date(item.updateTime) : null,
  }
}
