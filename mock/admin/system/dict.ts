import type { SysDict } from '#db/sys_dict_type'
import { defineMock, response } from '../../index'
import { cloneSysDictSeeds } from './seeds/dict'

type DictListPayload = {
  code?: string
  dictSource?: string
  label?: string
  page?: number
  pageSize?: number
  value?: string
}

const dictStore = cloneSysDictSeeds()

export default defineMock({
  '[POST]/admin/system/dict'({ data }) {
    const payload = normalizePayload(data)
    const filteredItems = queryDicts(payload)
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
  '[GET]/admin/system/dict/{id}'({ params }) {
    const item = findDictById(params.id)

    return response({
      code: 200,
      msg: 'success',
      data: item ? cloneDict(item) : null,
    })
  },
  '[GET]/admin/system/dict/parent-options'() {
    return response({
      code: 200,
      msg: 'success',
      data: queryParentOptions(),
    })
  },
  '[POST]/admin/system/dict/save'({ data }) {
    return response({
      code: 200,
      msg: 'success',
      data: saveDict(data),
    })
  },
  '[POST]/admin/system/dict/delete'({ data }) {
    return response({
      code: 200,
      msg: 'success',
      data: deleteDict(data),
    })
  },
})

function queryDicts(query: DictListPayload) {
  return getActiveDicts()
    .filter(item => {
      if (query.code && !includesIgnoreCase(item.code, query.code)) {
        return false
      }
      if (query.dictSource && item.dictSource !== query.dictSource) {
        return false
      }
      if (query.label && !includesIgnoreCase(item.label, query.label)) {
        return false
      }
      if (query.value && !includesIgnoreCase(item.value, query.value)) {
        return false
      }
      return true
    })
    .sort(compareBySort)
    .map(cloneDict)
}

function queryParentOptions() {
  return getActiveDicts().sort(compareBySort).map(cloneDict)
}

function getActiveDicts() {
  return dictStore.filter(item => item.isDelete !== '1')
}

function findDictById(id: unknown) {
  return getActiveDicts().find(item => item.id === String(id))
}

function saveDict(data: unknown) {
  const payload = normalizeRecord<SysDict>(data)
  const now = new Date()
  const existingItem = payload.id ? findDictById(payload.id) : undefined

  if (existingItem) {
    Object.assign(existingItem, {
      ...payload,
      id: existingItem.id,
      updateTime: now,
    })
    return cloneDict(existingItem)
  }

  const created: SysDict = {
    id: payload.id || `dict-${Date.now()}`,
    createId: 'mock-system-admin',
    createName: 'Mock System Admin',
    createTime: now,
    updateId: 'mock-system-admin',
    updateName: 'Mock System Admin',
    updateTime: now,
    code: payload.code ?? null,
    isDelete: '0',
    parentId: payload.parentId ?? null,
    parentPath: payload.parentPath ?? null,
    sort: payload.sort ?? 0,
    label: payload.label ?? null,
    value: payload.value ?? null,
    dictStatus: payload.dictStatus ?? 0,
    remark: payload.remark ?? null,
    dictSource: payload.dictSource ?? 'dict_source_custom',
    expand: payload.expand ?? null,
  }
  dictStore.push(created)
  return cloneDict(created)
}

function deleteDict(data: unknown) {
  const id = normalizeId(data)
  const index = dictStore.findIndex(item => item.id === id)
  if (index >= 0) {
    dictStore.splice(index, 1)
  }
  return { id }
}

function normalizePayload(data: unknown): DictListPayload {
  if (typeof data !== 'object' || data === null) {
    return {}
  }
  const payload = data as Record<string, unknown>
  return {
    code: toStringValue(payload.code),
    dictSource: toStringValue(payload.dictSource),
    label: toStringValue(payload.label),
    page: toNumber(payload.page),
    pageSize: toNumber(payload.pageSize),
    value: toStringValue(payload.value),
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

function compareBySort(left: SysDict, right: SysDict) {
  const leftSort = left.sort ?? 0
  const rightSort = right.sort ?? 0
  if (leftSort !== rightSort) {
    return leftSort - rightSort
  }
  return String(left.id).localeCompare(String(right.id))
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

function cloneDict(item: SysDict): SysDict {
  return {
    ...item,
    createTime: item.createTime ? new Date(item.createTime) : null,
    updateTime: item.updateTime ? new Date(item.updateTime) : null,
  }
}
