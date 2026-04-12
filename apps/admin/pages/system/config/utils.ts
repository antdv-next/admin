import type { SelectProps } from 'antdv-next'
import type { ConfigInfo } from '@/api/config'

export type ConfigFormRecord = ConfigInfo & {
  id: string
}

export function initFormRecord(): ConfigFormRecord {
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
    configKey: null,
    configName: null,
    configSource: 'config_source_custom',
    configType: null,
    configValue: null,
    sourceRemark: null,
  }
}

export function toConfigFormRecord(record?: Partial<ConfigInfo> | null): ConfigFormRecord {
  return {
    ...initFormRecord(),
    ...record,
    configSource: record?.configSource ?? 'config_source_custom',
    id: record?.id ?? '',
  }
}

export const configSourceOptions: SelectProps['options'] = [
  { label: '系统默认', value: 'config_source_system' },
  { label: '自定义', value: 'config_source_custom' },
]

export function getConfigSourceLabel(configSource?: ConfigInfo['configSource']) {
  return configSourceOptions?.find(item => item.value === configSource)?.label ?? '-'
}
