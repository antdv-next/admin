import type { SysDict } from '#db/sys_dict_type'
import { getActiveDicts } from '../admin/system/dict'
import { defineMock, response } from '../index'

export default defineMock({
  '[GET]/dict/list'() {
    return response({
      code: 200,
      msg: 'success',
      data: queryDictItemsByCodes(collectCategoryCodes()),
    })
  },
  '[GET]/dict/code/list'({ query }) {
    return response({
      code: 200,
      msg: 'success',
      data: queryDictItemsByCodes(normalizeCodes(query.code)),
    })
  },
})

// `useDict()` 约定：同一字典下的所有条目共享同一个分类 code，条目树在 code 分组内按
// parentId 组装。字典管理页维护的是「分类条目 + 各自独立 code 的子条目」，因此这里把
// 分类的后代条目统一改写为分类 code 后再返回。
function queryDictItemsByCodes(codes: readonly string[]) {
  const activeDicts = getActiveDicts()
  const childrenMap = buildChildrenMap(activeDicts)
  const resultMap = new Map<string, SysDict>()

  for (const code of codes) {
    for (const category of activeDicts) {
      if (category.code !== code) {
        continue
      }

      const descendants = collectDescendants(category, childrenMap)
      const items = descendants.length > 0 ? descendants : [category]
      for (const item of items) {
        resultMap.set(item.id, { ...item, code })
      }
    }
  }

  return [...resultMap.values()]
}

function collectCategoryCodes() {
  return [
    ...new Set(
      getActiveDicts()
        .filter(item => item.parentId == null)
        .map(item => item.code)
        .filter((code): code is string => Boolean(code)),
    ),
  ]
}

function buildChildrenMap(items: readonly SysDict[]) {
  const childrenMap = new Map<string, SysDict[]>()
  for (const item of items) {
    if (!item.parentId) {
      continue
    }
    const children = childrenMap.get(item.parentId) ?? []
    children.push(item)
    childrenMap.set(item.parentId, children)
  }
  return childrenMap
}

function collectDescendants(category: SysDict, childrenMap: Map<string, SysDict[]>) {
  const descendants: SysDict[] = []
  const queue = [...(childrenMap.get(category.id) ?? [])]

  while (queue.length > 0) {
    const item = queue.shift()
    if (!item) {
      continue
    }
    descendants.push(item)
    queue.push(...(childrenMap.get(item.id) ?? []))
  }

  return descendants
}

// alova 会把数组参数序列化为逗号拼接的单个值（code=a,b），这里两种形态都兼容。
function normalizeCodes(code: string | string[] | undefined) {
  const values = (Array.isArray(code) ? code : [code]).flatMap(item =>
    typeof item === 'string' ? item.split(',') : [],
  )
  return [...new Set(values.map(item => item.trim()).filter(item => item && item !== 'undefined'))]
}
