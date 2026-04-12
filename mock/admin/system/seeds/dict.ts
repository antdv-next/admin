import type { SysDict } from '#db/sys_dict_type'

const MOCK_OPERATOR_ID = 'mock-system-admin'
const MOCK_OPERATOR_NAME = 'Mock System Admin'
const MOCK_TIMESTAMP = new Date('2026-04-12T09:00:00+08:00')

type DictSeedInput = Partial<SysDict> & Pick<SysDict, 'id' | 'label'>

function createDictSeed(input: DictSeedInput): SysDict {
  return {
    id: input.id,
    createId: input.createId ?? MOCK_OPERATOR_ID,
    createName: input.createName ?? MOCK_OPERATOR_NAME,
    createTime: input.createTime ?? new Date(MOCK_TIMESTAMP),
    updateId: input.updateId ?? MOCK_OPERATOR_ID,
    updateName: input.updateName ?? MOCK_OPERATOR_NAME,
    updateTime: input.updateTime ?? new Date(MOCK_TIMESTAMP),
    code: input.code ?? null,
    isDelete: input.isDelete ?? '0',
    parentId: input.parentId ?? null,
    parentPath: input.parentPath ?? null,
    sort: input.sort ?? 0,
    label: input.label,
    value: input.value ?? null,
    dictStatus: input.dictStatus ?? 0,
    remark: input.remark ?? null,
    dictSource: input.dictSource ?? 'dict_source_custom',
    expand: input.expand ?? null,
  }
}

const sysDictSeeds: SysDict[] = [
  createDictSeed({
    id: 'dict-1',
    code: 'user_status',
    label: '用户状态',
    sort: 1,
    value: null,
  }),
  createDictSeed({
    id: 'dict-2',
    code: 'user_status_enabled',
    dictSource: 'dict_source_custom',
    dictStatus: 0,
    label: '启用',
    parentId: 'dict-1',
    parentPath: '/dict-1',
    sort: 1,
    value: 'enabled',
  }),
  createDictSeed({
    id: 'dict-3',
    code: 'user_status_disabled',
    dictSource: 'dict_source_custom',
    dictStatus: 0,
    label: '禁用',
    parentId: 'dict-1',
    parentPath: '/dict-1',
    sort: 2,
    value: 'disabled',
  }),
]

export function cloneSysDictSeeds() {
  return sysDictSeeds.map(item => ({
    ...item,
    createTime: item.createTime ? new Date(item.createTime) : null,
    updateTime: item.updateTime ? new Date(item.updateTime) : null,
  }))
}
