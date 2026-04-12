import type { SysConfig } from '#db/sys_config'
import { defineMock, response } from '../../index'
import { cloneSysConfigSeeds } from './seeds/config'

type ConfigListPayload = {
  configKey?: string
  configName?: string
  configType?: string
  page?: number
  pageSize?: number
}

const configStore = cloneSysConfigSeeds()

export default defineMock({
  '[POST]/admin/system/config'({ data }) {
    const payload = normalizePayload(data)
    const filteredItems = queryConfigs(payload)
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
  '[GET]/admin/system/config/{id}'({ params }) {
    const item = findConfigById(params.id)

    return response({
      code: 200,
      msg: 'success',
      data: item ? cloneConfig(item) : null,
    })
  },
  '[POST]/admin/system/config/save'({ data }) {
    return response({
      code: 200,
      msg: 'success',
      data: saveConfig(data),
    })
  },
  '[POST]/admin/system/config/delete'({ data }) {
    return response({
      code: 200,
      msg: 'success',
      data: deleteConfig(data),
    })
  },
})

function queryConfigs(query: ConfigListPayload) {
  return getActiveConfigs()
    .filter(item => {
      if (query.configKey && !includesIgnoreCase(item.configKey, query.configKey)) {
        return false
      }
      if (query.configName && !includesIgnoreCase(item.configName, query.configName)) {
        return false
      }
      if (query.configType && !includesIgnoreCase(item.configType, query.configType)) {
        return false
      }
      return true
    })
    .sort((left, right) => String(left.id).localeCompare(String(right.id)))
    .map(cloneConfig)
}

function getActiveConfigs() {
  return configStore.filter(item => !item.isDelete)
}

function findConfigById(id: unknown) {
  return getActiveConfigs().find(item => item.id === String(id))
}

function saveConfig(data: unknown) {
  const payload = normalizeRecord<SysConfig>(data)
  const now = new Date()
  const existingItem = payload.id ? findConfigById(payload.id) : undefined

  if (existingItem) {
    Object.assign(existingItem, {
      ...payload,
      id: existingItem.id,
      updateTime: now,
    })
    return cloneConfig(existingItem)
  }

  const created: SysConfig = {
    id: payload.id || `cfg-${Date.now()}`,
    createId: 'mock-system-admin',
    createName: 'Mock System Admin',
    createTime: now,
    updateId: 'mock-system-admin',
    updateName: 'Mock System Admin',
    updateTime: now,
    code: payload.code ?? null,
    isDelete: false,
    configKey: payload.configKey ?? null,
    configName: payload.configName ?? null,
    configSource: payload.configSource ?? 'config_source_custom',
    configType: payload.configType ?? null,
    configValue: payload.configValue ?? null,
    sourceRemark: payload.sourceRemark ?? null,
  }
  configStore.push(created)
  return cloneConfig(created)
}

function deleteConfig(data: unknown) {
  const id = normalizeId(data)
  const index = configStore.findIndex(item => item.id === id)
  if (index >= 0) {
    configStore.splice(index, 1)
  }
  return { id }
}

function normalizePayload(data: unknown): ConfigListPayload {
  if (typeof data !== 'object' || data === null) {
    return {}
  }
  const payload = data as Record<string, unknown>
  return {
    configKey: toStringValue(payload.configKey),
    configName: toStringValue(payload.configName),
    configType: toStringValue(payload.configType),
    page: toNumber(payload.page),
    pageSize: toNumber(payload.pageSize),
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

function cloneConfig(item: SysConfig): SysConfig {
  return {
    ...item,
    createTime: item.createTime ? new Date(item.createTime) : null,
    updateTime: item.updateTime ? new Date(item.updateTime) : null,
  }
}
