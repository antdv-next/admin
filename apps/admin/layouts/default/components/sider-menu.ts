import type { MenuProps } from 'antdv-next'
import type { MenuInfo } from '@/api/menu'
import { MENU_TYPE } from '@/constants/menu'
import { createMenuTree, findMenuNodeChainByPath, resolveMenuKey } from '@/utils/menu-breadcrumb'
import type { MenuTreeNode } from '@/utils/menu-breadcrumb'

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

function mapTreeToMenuItems(nodes: readonly MenuTreeNode[]): NonNullable<MenuProps['items']> {
  return nodes.flatMap(node => {
    const key = resolveMenuKey(node)
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
    const key = resolveMenuKey(node)
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
  const tree = createMenuTree(menus, {
    includeHiddenInMenu: false,
  })
  const items = mapTreeToMenuItems(tree)
  const activeKeyPath = findMenuNodeChainByPath(tree, currentPath)
    .map(node => resolveMenuKey(node))
    .filter((key): key is string => Boolean(key))
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

  const mergedOpenKeys = dedupeKeys([...currentOpenKeys, ...routeOpenKeys])

  return {
    openKeys: mergedOpenKeys,
    cachedOpenKeys: mergedOpenKeys,
  }
}

function dedupeKeys(keys: readonly string[]) {
  return [...new Set(keys)]
}
