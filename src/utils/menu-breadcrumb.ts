import type { MenuInfo } from '@/api/menu'
import { MENU_TYPE } from '@/constants/menu'
import type { TreeNode } from '@/utils/to-tree'
import { toTree } from '@/utils/to-tree'

export interface MenuBreadcrumbItem {
  key: string
  icon?: string
  title: string
  path?: string
}

export interface CreateMenuTreeOptions {
  includeHiddenInMenu?: boolean
}

export type MenuTreeNode = TreeNode<MenuInfo>

export function resolveMenuKey(menu: Pick<MenuInfo, 'id' | 'path'>) {
  return menu.path ?? menu.id ?? null
}

export function createMenuTree(
  menus: readonly MenuInfo[],
  options: CreateMenuTreeOptions = {},
): MenuTreeNode[] {
  const { includeHiddenInMenu = true } = options

  return toTree(
    menus.filter(menu => {
      if (menu.menuType === MENU_TYPE.BUTTON) {
        return false
      }

      return includeHiddenInMenu || menu.hideInMenu !== 1
    }),
    {
      getId: menu => menu.id,
      getParentId: menu => menu.parentId,
      getSortValue: menu => menu.sort,
    },
  )
}

export function findMenuNodeChainByPath(
  nodes: readonly MenuTreeNode[],
  currentPath: string,
  parentNodes: readonly MenuTreeNode[] = [],
): MenuTreeNode[] {
  const normalizedCurrentPath = normalizePath(currentPath)
  if (!normalizedCurrentPath) {
    return []
  }

  for (const node of nodes) {
    const nextNodes = [...parentNodes, node]

    if (normalizePath(node.path) === normalizedCurrentPath) {
      return nextNodes
    }

    if (!node.children.length) {
      continue
    }

    const matchedNodes = findMenuNodeChainByPath(node.children, normalizedCurrentPath, nextNodes)
    if (matchedNodes.length) {
      return matchedNodes
    }
  }

  return []
}

export function resolveMenuBreadcrumbItems(
  menus: readonly MenuInfo[],
  currentPath: string,
): MenuBreadcrumbItem[] {
  const matchedNodes = findMenuNodeChainByPath(createMenuTree(menus), currentPath)

  return matchedNodes.flatMap(node => {
    if (node.hideInBreadcrumb === 1) {
      return []
    }

    const key = resolveMenuKey(node)
    if (!key) {
      return []
    }

    return [
      {
        key,
        ...(node.icon ? { icon: node.icon } : {}),
        title: node.title || node.name || key,
        ...(node.path ? { path: normalizePath(node.path) } : {}),
      },
    ]
  })
}

function normalizePath(path?: string | null) {
  if (!path) {
    return undefined
  }

  if (path === '/') {
    return path
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  return normalizedPath.replace(/\/+$/, '')
}
