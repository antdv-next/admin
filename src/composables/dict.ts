import type { DictInfo } from '@/api/dict'
import { getDictListByCodeMethod, getGlobalDictListMethod } from '@/api/dict'
import { toTree } from '@/utils/to-tree'
import type { TreeNode } from '@/utils/to-tree'

export type DictTreeInfo = TreeNode<DictInfo>
export type DictCodeInput = string | readonly string[]
export type DictTreeMap = Record<string, DictTreeInfo[]>
type MergeGlobalDictCode<TCode extends string, TGlobal extends string = KnownGlobalDictCodeType> = [
  TGlobal,
] extends [never]
  ? TCode
  : TCode | TGlobal
export type DictKnownCode<TCodes extends DictCodeInput | undefined> =
  TCodes extends readonly string[]
    ? MergeGlobalDictCode<TCodes[number]>
    : TCodes extends string
      ? MergeGlobalDictCode<TCodes>
      : KnownGlobalDictCodeType
export type DictCodeKey<TCodes extends DictCodeInput | undefined> = [
  DictKnownCode<TCodes>,
] extends [never]
  ? string
  : DictKnownCode<TCodes> | (string & {})
type DictItemMap = Record<string, DictInfo[]>
export interface DictOption {
  children: DictOption[]
  disabled?: boolean
  key: string
  label: string
  title: string
  value: string
}
export interface DictOptionFieldMap {
  children?: string
  label?: string
  value?: string
}
type ResolveOptionFieldKey<
  TFieldMap extends DictOptionFieldMap | undefined,
  TField extends keyof DictOptionFieldMap,
  TDefault extends string,
> = TFieldMap extends DictOptionFieldMap
  ? TFieldMap[TField] extends string
    ? TFieldMap[TField]
    : TDefault
  : TDefault
export type DictMappedOption<TFieldMap extends DictOptionFieldMap | undefined = undefined> =
  DictOption &
    Record<ResolveOptionFieldKey<TFieldMap, 'label', 'label'>, string> &
    Record<ResolveOptionFieldKey<TFieldMap, 'value', 'value'>, string> & {
      [K in ResolveOptionFieldKey<TFieldMap, 'children', 'children'>]: DictMappedOption<TFieldMap>[]
    }
export interface UseDictResult<TCodes extends DictCodeInput | undefined = undefined> {
  dictMap: Readonly<Record<string, DictTreeInfo[]>>
  getDict: (code: DictCodeKey<TCodes>) => DictTreeInfo[]
  getItem: (code: DictCodeKey<TCodes>, value: string) => DictTreeInfo | undefined
  getLabel: (code: DictCodeKey<TCodes>, value: string) => string
  getDicts: (codes: readonly string[]) => DictTreeMap
  getOptions: <TFieldMap extends DictOptionFieldMap | undefined = undefined>(
    code: DictCodeKey<TCodes>,
    fieldMap?: TFieldMap,
  ) => DictMappedOption<TFieldMap>[]
  globalDicts: Readonly<Ref<DictTreeInfo[]>>
  globalDictMap: Readonly<Record<string, DictTreeInfo[]>>
  globalDictsLoaded: Readonly<Ref<boolean>>
  globalDictsLoading: Readonly<Ref<boolean>>
  isDictLoaded: (code: string) => boolean
  isDictLoading: (code: string) => boolean
  loadDict: {
    (code: string, force?: boolean): Promise<DictTreeInfo[]>
    (code: readonly string[], force?: boolean): Promise<DictTreeMap>
  }
  loadGlobalDict: (force?: boolean) => Promise<DictTreeInfo[]>
}

function buildDictTree(items: readonly DictInfo[]) {
  return toTree(items, {
    getId: item => item.id,
    getParentId: item => item.parentId,
    getSortValue: item => item.sort,
  })
}

function replaceDictTreeMap(target: Record<string, DictTreeInfo[]>, next: DictTreeMap) {
  for (const key of Object.keys(target)) {
    if (!(key in next)) {
      delete target[key]
    }
  }

  for (const [key, value] of Object.entries(next)) {
    target[key] = value
  }
}

function normalizeDictCodes(code: DictCodeInput) {
  const values = Array.isArray(code) ? code : [code]
  return [...new Set(values.filter((item): item is string => Boolean(item)))]
}

function createDictRequestKey(codes: readonly string[]) {
  return [...codes].sort().join('|')
}

function collectDictCodes(items: readonly DictInfo[]) {
  return [...new Set(items.map(item => item.code).filter((item): item is string => Boolean(item)))]
}

function buildDictTreeMap(items: readonly DictInfo[], codes: readonly string[]) {
  const groupedItems: DictItemMap = {}

  for (const code of codes) {
    groupedItems[code] = []
  }

  for (const item of items) {
    const code = item.code
    if (!code || !(code in groupedItems)) {
      continue
    }
    const target = groupedItems[code]
    if (!target) {
      continue
    }
    target.push(item)
  }

  return Object.fromEntries(
    codes.map(code => [code, buildDictTree(groupedItems[code] ?? [])]),
  ) as DictTreeMap
}

function findDictNode(nodes: readonly DictTreeInfo[], value: string): DictTreeInfo | undefined {
  for (const node of nodes) {
    if (node.value === value) {
      return node
    }

    const child = findDictNode(node.children, value)
    if (child) {
      return child
    }
  }

  return undefined
}

function mapDictNodeToOption<TFieldMap extends DictOptionFieldMap | undefined = undefined>(
  node: DictTreeInfo,
  fieldMap?: TFieldMap,
): DictMappedOption<TFieldMap> {
  const optionValue = String(node.value ?? node.id ?? '')
  const labelKey = fieldMap?.label ?? 'label'
  const valueKey = fieldMap?.value ?? 'value'
  const childrenKey = fieldMap?.children ?? 'children'
  const children = node.children.map(child => mapDictNodeToOption(child, fieldMap))

  return {
    children,
    disabled: node.dictStatus === 1 ? true : undefined,
    key: optionValue,
    label: node.label ?? optionValue,
    title: node.label ?? optionValue,
    value: optionValue,
    [childrenKey]: children,
    [labelKey]: node.label ?? optionValue,
    [valueKey]: optionValue,
  } as DictMappedOption<TFieldMap>
}

const useDictState = createGlobalState(() => {
  const globalDicts = shallowRef<DictTreeInfo[]>([])
  const globalDictMap = reactive<Record<string, DictTreeInfo[]>>({})
  const globalDictsLoaded = shallowRef(false)
  const globalDictsLoading = shallowRef(false)
  const dictMap = reactive<Record<string, DictTreeInfo[]>>({})
  const dictLoadedMap = reactive<Record<string, boolean>>({})
  const dictLoadingMap = reactive<Record<string, boolean>>({})
  let globalDictPromise: Promise<DictTreeInfo[]> | null = null
  const dictPromiseMap = new Map<string, Promise<DictTreeMap>>()

  async function loadGlobalDict(force = false) {
    if (!force && globalDictsLoaded.value) {
      return globalDicts.value
    }
    if (globalDictPromise) {
      return globalDictPromise
    }

    globalDictsLoading.value = true
    globalDictPromise = (async () => {
      try {
        const response = await getGlobalDictListMethod()
        const items = response.data ?? []
        const nextDicts = buildDictTree(items)
        const nextDictMap = buildDictTreeMap(items, collectDictCodes(items))
        globalDicts.value = nextDicts
        replaceDictTreeMap(globalDictMap, nextDictMap)
        globalDictsLoaded.value = true
        return nextDicts
      } catch {
        globalDicts.value = []
        replaceDictTreeMap(globalDictMap, {})
        globalDictsLoaded.value = false
        return []
      } finally {
        globalDictsLoading.value = false
        globalDictPromise = null
      }
    })()

    return globalDictPromise
  }

  function resolveDict(code: string) {
    if (code in dictMap) {
      return dictMap[code] ?? []
    }

    return globalDictMap[code] ?? []
  }

  function getDicts(codes: readonly string[]) {
    return Object.fromEntries(codes.map(code => [code, resolveDict(code)])) as DictTreeMap
  }

  async function loadDict(code: string, force?: boolean): Promise<DictTreeInfo[]>
  async function loadDict(code: readonly string[], force?: boolean): Promise<DictTreeMap>
  async function loadDict(code: DictCodeInput, force = false) {
    const codes = normalizeDictCodes(code)
    if (codes.length === 0) {
      return Array.isArray(code) ? {} : []
    }
    if (!force && codes.every(item => dictLoadedMap[item])) {
      const cachedDicts = getDicts(codes)
      if (Array.isArray(code)) {
        return cachedDicts
      }
      const singleCode = code as string
      return cachedDicts[singleCode] ?? []
    }

    const requestCodes = force ? codes : codes.filter(item => !dictLoadedMap[item])
    const requestKey = createDictRequestKey(requestCodes)
    const currentPromise = dictPromiseMap.get(requestKey)
    if (currentPromise) {
      if (Array.isArray(code)) {
        return currentPromise
      }

      const singleCode = code as string
      return currentPromise.then(dicts => dicts[singleCode] ?? [])
    }

    for (const item of requestCodes) {
      dictLoadingMap[item] = true
    }

    const requestPromise: Promise<DictTreeMap> = (async () => {
      try {
        const response = await getDictListByCodeMethod(requestCodes)
        const nextDicts = buildDictTreeMap(response.data ?? [], requestCodes)

        for (const item of requestCodes) {
          dictMap[item] = nextDicts[item] ?? []
          dictLoadedMap[item] = true
        }

        return getDicts(codes)
      } catch (error) {
        for (const item of requestCodes) {
          dictLoadedMap[item] = false
        }
        throw error
      } finally {
        for (const item of requestCodes) {
          dictLoadingMap[item] = false
        }
        dictPromiseMap.delete(requestKey)
      }
    })()

    dictPromiseMap.set(requestKey, requestPromise)
    if (Array.isArray(code)) {
      return requestPromise
    }

    const singleCode = code as string
    return requestPromise.then(dicts => dicts[singleCode] ?? [])
  }

  function getDict(code: string) {
    return resolveDict(code)
  }

  function getItem(code: string, value: string) {
    if (!value) {
      return undefined
    }

    return findDictNode(resolveDict(code), value)
  }

  function getLabel(code: string, value: string) {
    return getItem(code, value)?.label ?? ''
  }

  function getOptions<TFieldMap extends DictOptionFieldMap | undefined = undefined>(
    code: string,
    fieldMap?: TFieldMap,
  ) {
    return resolveDict(code).map(item => mapDictNodeToOption(item, fieldMap))
  }

  function isDictLoaded(code: string) {
    return Boolean(dictLoadedMap[code])
  }

  function isDictLoading(code: string) {
    return Boolean(dictLoadingMap[code])
  }

  return {
    dictMap: readonly(dictMap),
    getDict,
    getItem,
    getLabel,
    getDicts,
    getOptions,
    globalDicts: readonly(globalDicts),
    globalDictMap: readonly(globalDictMap),
    globalDictsLoaded: readonly(globalDictsLoaded),
    globalDictsLoading: readonly(globalDictsLoading),
    isDictLoaded,
    isDictLoading,
    loadDict,
    loadGlobalDict,
  }
})

export function useDict<TCodes extends DictCodeInput | undefined = undefined>(codes?: TCodes) {
  const dict = useDictState()
  const normalizedCodes = codes ? normalizeDictCodes(codes) : []

  if (
    normalizedCodes.length > 0 &&
    normalizedCodes.some(code => !dict.isDictLoaded(code) && !dict.isDictLoading(code))
  ) {
    void dict.loadDict(normalizedCodes)
  }

  return dict as UseDictResult<TCodes>
}
