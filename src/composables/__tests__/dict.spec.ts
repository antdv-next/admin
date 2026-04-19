import { beforeEach, describe, expect, it, vi } from 'vite-plus/test'
import type { DictInfo } from '@/api/dict'
import type { DictCodeKey } from '@/composables/dict'

declare global {
  interface DictCodeRegistry {
    global_status: true
  }
}

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false
type Expect<T extends true> = T

const getGlobalDictListMethod = vi.fn<() => Promise<{ data: DictInfo[] }>>()
const getDictListByCodeMethod =
  vi.fn<(code: string | readonly string[]) => Promise<{ data: DictInfo[] }>>()

vi.mock('@/api/dict', () => ({
  getGlobalDictListMethod,
  getDictListByCodeMethod,
}))

function createDeferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason?: unknown) => void

  const promise = new Promise<T>((innerResolve, innerReject) => {
    resolve = innerResolve
    reject = innerReject
  })

  return { promise, resolve, reject }
}

function createDict(partial: Partial<DictInfo>): DictInfo {
  return {
    id: partial.id ?? 'dict-id',
    code: partial.code ?? null,
    createId: null,
    createName: null,
    createTime: null,
    dictSource: 'dict_source_custom',
    dictStatus: 0,
    expand: partial.expand ?? null,
    isDelete: '0',
    label: partial.label ?? null,
    parentId: partial.parentId ?? null,
    parentPath: null,
    remark: null,
    sort: partial.sort ?? 0,
    updateId: null,
    updateName: null,
    updateTime: null,
    value: partial.value ?? partial.id ?? null,
  }
}

describe('useDict', () => {
  beforeEach(() => {
    getGlobalDictListMethod.mockReset()
    getDictListByCodeMethod.mockReset()
    vi.resetModules()
  })

  it('loads global dicts as a tree and deduplicates concurrent requests', async () => {
    const deferred = createDeferred<{ data: DictInfo[] }>()
    getGlobalDictListMethod.mockReturnValue(deferred.promise)

    const { useDict } = await import('@/composables/dict')
    const dict = useDict()

    const firstRequest = dict.loadGlobalDict()
    const secondRequest = dict.loadGlobalDict()

    expect(getGlobalDictListMethod).toHaveBeenCalledTimes(1)
    expect(dict.globalDictsLoading.value).toBe(true)

    deferred.resolve({
      data: [
        createDict({ id: 'child-b', parentId: 'root', sort: 2, label: 'Child B' }),
        createDict({ id: 'root', sort: 1, label: 'Root' }),
        createDict({ id: 'child-a', parentId: 'root', sort: 1, label: 'Child A' }),
      ],
    })

    await expect(firstRequest).resolves.toMatchObject([
      {
        id: 'root',
        children: [
          { id: 'child-a', children: [] },
          { id: 'child-b', children: [] },
        ],
      },
    ])
    await expect(secondRequest).resolves.toMatchObject([
      {
        id: 'root',
        children: [
          { id: 'child-a', children: [] },
          { id: 'child-b', children: [] },
        ],
      },
    ])

    expect(dict.globalDictsLoaded.value).toBe(true)
    expect(dict.globalDictsLoading.value).toBe(false)
    expect(dict.globalDicts.value).toMatchObject([
      {
        id: 'root',
        children: [{ id: 'child-a' }, { id: 'child-b' }],
      },
    ])
  })

  it('keeps literal code hints while still accepting string', () => {
    const typedCodeHintCheck: Expect<
      Equal<
        DictCodeKey<readonly ['user_status', 'order_status']>,
        'global_status' | 'user_status' | 'order_status' | (string & {})
      >
    > = true

    expect(typedCodeHintCheck).toBe(true)
  })

  it('keeps code hints after destructuring methods from useDict', async () => {
    getDictListByCodeMethod.mockResolvedValue({
      data: [],
    })

    const { useDict } = await import('@/composables/dict')
    const { getOptions, getLabel } = useDict(['user_status'] as const)

    const typedGetOptionsCheck: Expect<
      Equal<Parameters<typeof getOptions>[0], 'global_status' | 'user_status' | (string & {})>
    > = true
    const typedGetLabelCheck: Expect<
      Equal<Parameters<typeof getLabel>[0], 'global_status' | 'user_status' | (string & {})>
    > = true

    expect(typedGetOptionsCheck).toBe(true)
    expect(typedGetLabelCheck).toBe(true)
  })

  it('supports custom field mapping in getOptions', async () => {
    getDictListByCodeMethod.mockResolvedValue({
      data: [
        createDict({ id: 'enabled', code: 'user_status', sort: 1, label: 'Enabled', value: '1' }),
        createDict({
          id: 'enabled-child',
          code: 'user_status',
          parentId: 'enabled',
          sort: 1,
          label: 'Enabled Child',
          value: '1-1',
        }),
      ],
    })

    const { useDict } = await import('@/composables/dict')
    const dict = useDict(['user_status'] as const)

    await expect(dict.loadDict('user_status')).resolves.toHaveLength(1)

    expect(
      dict.getOptions('user_status', {
        children: 'nodes',
        label: 'name',
        value: 'id',
      }),
    ).toMatchObject([
      {
        id: '1',
        key: '1',
        name: 'Enabled',
        title: 'Enabled',
        nodes: [
          {
            id: '1-1',
            key: '1-1',
            name: 'Enabled Child',
            title: 'Enabled Child',
          },
        ],
      },
    ])
  })

  it('merges parsed expand fields only when mergeExpand is enabled', async () => {
    getDictListByCodeMethod.mockResolvedValue({
      data: [
        createDict({
          id: 'enabled',
          code: 'user_status',
          label: 'Enabled',
          value: '1',
          expand: JSON.stringify({
            color: 'green',
            label: 'Expand Label',
            tagType: 'success',
            value: 'expand-value',
          }),
        }),
      ],
    })

    const { useDict } = await import('@/composables/dict')
    const dict = useDict(['user_status'] as const)

    await expect(dict.loadDict('user_status')).resolves.toHaveLength(1)

    expect(dict.getItem('user_status', '1')).not.toHaveProperty('color')
    expect(dict.getOptions('user_status')).toMatchObject([
      {
        label: 'Enabled',
        value: '1',
      },
    ])
    expect(
      (dict.getItem as (...args: any[]) => any)('user_status', '1', { mergeExpand: true }),
    ).toMatchObject({
      color: 'green',
      label: 'Enabled',
      tagType: 'success',
      value: '1',
    })
    expect(
      (dict.getOptions as (...args: any[]) => any)('user_status', undefined, { mergeExpand: true }),
    ).toMatchObject([
      {
        color: 'green',
        label: 'Enabled',
        tagType: 'success',
        value: '1',
      },
    ])
  })

  it('supports loading multiple dict codes in one request and caches them by code', async () => {
    const deferred = createDeferred<{ data: DictInfo[] }>()
    getDictListByCodeMethod.mockReturnValue(deferred.promise)

    const { useDict } = await import('@/composables/dict')
    const dict = useDict(['user_status', 'order_status'])

    const firstRequest = dict.loadDict(['user_status', 'order_status'])
    const secondRequest = dict.loadDict(['order_status', 'user_status'])

    expect(getDictListByCodeMethod).toHaveBeenCalledTimes(1)
    expect(getDictListByCodeMethod).toHaveBeenCalledWith(['user_status', 'order_status'])
    expect(dict.isDictLoading('user_status')).toBe(true)
    expect(dict.isDictLoading('order_status')).toBe(true)

    deferred.resolve({
      data: [
        createDict({ id: 'enabled', code: 'user_status', sort: 1, label: 'Enabled' }),
        createDict({
          id: 'enabled-child',
          code: 'user_status',
          parentId: 'enabled',
          sort: 1,
          label: 'Enabled Child',
        }),
        createDict({ id: 'paid', code: 'order_status', sort: 1, label: 'Paid' }),
      ],
    })

    await expect(firstRequest).resolves.toMatchObject({
      user_status: [
        {
          id: 'enabled',
          children: [{ id: 'enabled-child', children: [] }],
        },
      ],
      order_status: [
        {
          id: 'paid',
          children: [],
        },
      ],
    })
    await expect(secondRequest).resolves.toMatchObject({
      user_status: [
        {
          id: 'enabled',
          children: [{ id: 'enabled-child', children: [] }],
        },
      ],
      order_status: [
        {
          id: 'paid',
          children: [],
        },
      ],
    })

    expect(dict.isDictLoaded('user_status')).toBe(true)
    expect(dict.isDictLoaded('order_status')).toBe(true)
    expect(dict.isDictLoading('user_status')).toBe(false)
    expect(dict.isDictLoading('order_status')).toBe(false)
    expect(dict.getDict('user_status')).toMatchObject([
      {
        id: 'enabled',
        children: [{ id: 'enabled-child' }],
      },
    ])
    expect(dict.getDict('order_status')).toMatchObject([
      {
        id: 'paid',
        children: [],
      },
    ])
    expect(dict.getItem('user_status', 'enabled')?.label).toBe('Enabled')
    expect(dict.getLabel('user_status', 'enabled-child')).toBe('Enabled Child')
    expect(dict.getOptions('user_status')).toMatchObject([
      {
        key: 'enabled',
        label: 'Enabled',
        title: 'Enabled',
        value: 'enabled',
        children: [
          {
            key: 'enabled-child',
            label: 'Enabled Child',
            title: 'Enabled Child',
            value: 'enabled-child',
          },
        ],
      },
    ])

    await expect(dict.loadDict('user_status')).resolves.toMatchObject([
      {
        id: 'enabled',
        children: [{ id: 'enabled-child' }],
      },
    ])
    await expect(dict.loadDict(['user_status', 'order_status'])).resolves.toMatchObject({
      user_status: [
        {
          id: 'enabled',
          children: [{ id: 'enabled-child' }],
        },
      ],
      order_status: [
        {
          id: 'paid',
          children: [],
        },
      ],
    })
    expect(getDictListByCodeMethod).toHaveBeenCalledTimes(1)
  })

  it('reads global dict labels when no page dict code is provided', async () => {
    getGlobalDictListMethod.mockResolvedValue({
      data: [
        createDict({ id: 'global-enabled', code: 'global_status', label: '启用', value: '1' }),
      ],
    })

    const { useDict } = await import('@/composables/dict')
    const dict = useDict()

    await expect(dict.loadGlobalDict()).resolves.toMatchObject([
      {
        id: 'global-enabled',
      },
    ])

    expect(dict.getItem('global_status', '1')?.label).toBe('启用')
    expect(dict.getLabel('global_status', '1')).toBe('启用')
    expect(dict.getOptions('global_status')).toMatchObject([
      {
        key: '1',
        label: '启用',
        title: '启用',
        value: '1',
      },
    ])
  })

  it('returns an empty global dict list when preload fails', async () => {
    getGlobalDictListMethod.mockRejectedValue(new Error('network error'))

    const { useDict } = await import('@/composables/dict')
    const dict = useDict()

    await expect(dict.loadGlobalDict()).resolves.toEqual([])

    expect(dict.globalDicts.value).toEqual([])
    expect(dict.globalDictsLoaded.value).toBe(false)
    expect(dict.globalDictsLoading.value).toBe(false)
  })
})
