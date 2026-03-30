import type { MenuProps } from 'antdv-next'
import type { MenuInfo } from '@/api/menu'
import { MENU_TYPE } from '@/constants/menu'
import { toTree } from '@/utils/to-tree'

export interface SiderMenuState {
  items: NonNullable<MenuProps['items']>
  navigableKeys: string[]
  openKeys: string[]
  selectedKeys: string[]
}

interface ResolveSiderOpenKeysOptions {
  collapsed: boolean
  previousCollapsed: boolean
  currentOpenKeys: string[]
  cachedOpenKeys: string[]
  routeOpenKeys: string[]
}

interface ResolvedSiderOpenKeys {
  openKeys: string[]
  cachedOpenKeys: string[]
}

type MenuTreeNode = ReturnType<typeof createMenuTree>[number]

function getMenuKey(menu: Pick<MenuInfo, 'id' | 'path'>) {
  return menu.path ?? menu.id ?? null
}

function isVisibleMenu(menu: MenuInfo) {
  return menu.hideInMenu !== 1 && menu.menuType !== MENU_TYPE.BUTTON
}

function createMenuTree(menus: readonly MenuInfo[]) {
  return toTree(menus.filter(isVisibleMenu), {
    getId: menu => menu.id,
    getParentId: menu => menu.parentId,
    getSortValue: menu => menu.sort,
  })
}

function findMenuKeyPathByPath(
  nodes: readonly MenuTreeNode[],
  currentPath: string,
  parentKeys: string[] = [],
): string[] {
  for (const node of nodes) {
    const key = getMenuKey(node)
    if (!key) {
      continue
    }

    const nextKeyPath = [...parentKeys, key]

    if (node.path === currentPath) {
      return nextKeyPath
    }

    if (!node.children.length) {
      continue
    }

    const matchedKeyPath = findMenuKeyPathByPath(node.children, currentPath, nextKeyPath)
    if (matchedKeyPath.length) {
      return matchedKeyPath
    }
  }

  return []
}

function mapTreeToMenuItems(nodes: readonly MenuTreeNode[]): NonNullable<MenuProps['items']> {
  return nodes.flatMap(node => {
    const key = getMenuKey(node)
    if (!key) {
      return []
    }

    const children = node.hideChildrenInMenu === 1 ? [] : mapTreeToMenuItems(node.children)
    const hasChildren = children.length > 0
    const isDisabled = node.menuStatus === 1

    if (!hasChildren && !node.path && node.menuType === MENU_TYPE.DIR) {
      return []
    }

    if (hasChildren) {
      return [
        {
          key,
          label: node.title || node.name || key,
          icon: node.icon ?? undefined,
          disabled: isDisabled,
          children,
          onTitleClick: () => {
            // Reserved for future parent-route navigation behavior.
          },
        },
      ]
    }

    return [
      {
        key,
        label: node.title || node.name || key,
        icon: node.icon ?? undefined,
        disabled: isDisabled,
      },
    ]
  })
}

function collectNavigableKeys(nodes: readonly MenuTreeNode[]): string[] {
  return nodes.flatMap(node => {
    const key = getMenuKey(node)
    if (!key) {
      return []
    }

    const hasVisibleChildren = node.hideChildrenInMenu !== 1 && node.children.length > 0
    if (!hasVisibleChildren) {
      return node.path ? [key] : []
    }

    return collectNavigableKeys(node.children)
  })
}

export function createSiderMenuState(
  menus: readonly MenuInfo[],
  currentPath: string,
): SiderMenuState {
  const tree = createMenuTree(menus)
  const items = mapTreeToMenuItems(tree)
  const activeKeyPath = findMenuKeyPathByPath(tree, currentPath)
  const selectedKey = activeKeyPath[activeKeyPath.length - 1]

  return {
    items,
    navigableKeys: collectNavigableKeys(tree),
    selectedKeys: selectedKey ? [selectedKey] : [],
    openKeys: activeKeyPath.slice(0, -1),
  }
}

export function resolveSiderOpenKeys(options: ResolveSiderOpenKeysOptions): ResolvedSiderOpenKeys {
  const { collapsed, previousCollapsed, currentOpenKeys, cachedOpenKeys, routeOpenKeys } = options

  if (collapsed) {
    return {
      openKeys: [],
      cachedOpenKeys: previousCollapsed ? cachedOpenKeys : currentOpenKeys,
    }
  }

  if (previousCollapsed) {
    return {
      openKeys: cachedOpenKeys.length ? cachedOpenKeys : routeOpenKeys,
      cachedOpenKeys,
    }
  }

  return {
    openKeys: routeOpenKeys,
    cachedOpenKeys,
  }
}
