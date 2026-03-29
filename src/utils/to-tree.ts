export type TreeNode<T extends object> = T & {
  children: TreeNode<T>[]
}

interface ToTreeOptions<T extends object, Id extends PropertyKey> {
  getId: (item: T) => Id | null | undefined
  getParentId?: (item: T) => Id | null | undefined
  getSortValue?: (item: T) => number | null | undefined
}

interface IndexedNode<T extends object> {
  index: number
  node: TreeNode<T>
}

function normalizeSortValue(value: number | null | undefined) {
  return typeof value === 'number' && Number.isFinite(value) ? value : Number.MAX_SAFE_INTEGER
}

export function toTree<T extends object, Id extends PropertyKey>(
  items: readonly T[],
  options: ToTreeOptions<T, Id>,
): TreeNode<T>[] {
  const indexedNodes = new Map<Id, IndexedNode<T>>()
  const roots: IndexedNode<T>[] = []

  items.forEach((item, index) => {
    const id = options.getId(item)
    if (id == null) {
      return
    }

    indexedNodes.set(id, {
      index,
      node: {
        ...item,
        children: [],
      },
    })
  })

  for (const item of items) {
    const id = options.getId(item)
    if (id == null) {
      continue
    }

    const indexedNode = indexedNodes.get(id)
    if (!indexedNode) {
      continue
    }

    const parentId = options.getParentId?.(item)
    if (parentId == null) {
      roots.push(indexedNode)
      continue
    }

    const indexedParentNode = indexedNodes.get(parentId)
    if (!indexedParentNode) {
      roots.push(indexedNode)
      continue
    }

    indexedParentNode.node.children.push(indexedNode.node)
  }

  const sortNodes = (nodes: IndexedNode<T>[]) => {
    nodes.sort((left, right) => {
      const leftSortValue = normalizeSortValue(options.getSortValue?.(left.node))
      const rightSortValue = normalizeSortValue(options.getSortValue?.(right.node))

      if (leftSortValue !== rightSortValue) {
        return leftSortValue - rightSortValue
      }

      return left.index - right.index
    })

    return nodes.map(({ node }) => {
      node.children = sortNodes(
        node.children.map((childNode, index) => ({
          index,
          node: childNode,
        })),
      )

      return node
    })
  }

  return sortNodes(roots)
}
