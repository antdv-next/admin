import type { SelectProps } from 'antdv-next'
import type { MenuInfo } from '@/api/menu'
import { MenuTypeEnum, type MenuTypeKind } from '@/constants/menu'

type MenuTypeInput = MenuInfo['menuType'] | undefined

// Drizzle infers smallint without .notNull() as `number | null`.
// This form-local type overrides those fields to be non-nullable so that
// switch bindings and input-number never receive null.
export type MenuFormRecord = Omit<
  MenuInfo,
  | 'sort'
  | 'menuStatus'
  | 'hideInMenu'
  | 'hideInBreadcrumb'
  | 'hideChildrenInMenu'
  | 'keepAlive'
  | 'affix'
> & {
  sort: number
  menuStatus: number
  hideInMenu: number
  hideInBreadcrumb: number
  hideChildrenInMenu: number
  keepAlive: number
  affix: number
}

export function initFormRecord(): MenuFormRecord {
  return {
    id: '',
    isDelete: false,
    parentId: null,
    parentPath: null,
    createId: null,
    createName: null,
    createTime: null,
    updateId: null,
    updateName: null,
    updateTime: null,
    code: null,
    menuType: null,
    title: null,
    icon: null,
    locale: null,
    path: null,
    name: null,
    component: null,
    redirect: null,
    target: null,
    url: null,
    permission: null,
    parentKeys: null,
    sort: 0,
    menuStatus: 0,
    hideInMenu: 0,
    hideInBreadcrumb: 0,
    hideChildrenInMenu: 0,
    keepAlive: 0,
    affix: 0,
  }
}

export function toMenuFormRecord(record?: Partial<MenuInfo> | null): MenuFormRecord {
  return {
    ...initFormRecord(),
    ...record,
    affix: record?.affix ?? 0,
    hideChildrenInMenu: record?.hideChildrenInMenu ?? 0,
    hideInBreadcrumb: record?.hideInBreadcrumb ?? 0,
    hideInMenu: record?.hideInMenu ?? 0,
    keepAlive: record?.keepAlive ?? 0,
    menuStatus: record?.menuStatus ?? 0,
    sort: record?.sort ?? 0,
  }
}

export const menuTypeOptions: SelectProps['options'] = MenuTypeEnum.items

export function getMenuTypeItem(menuType?: MenuTypeInput) {
  if (!menuType) return undefined

  return MenuTypeEnum.findBy('value', menuType)
}

export function getMenuTypeLabel(menuType?: MenuTypeInput) {
  return getMenuTypeItem(menuType)?.label
}

export function getMenuTypeTagColor(menuType?: MenuTypeInput) {
  return getMenuTypeItem(menuType)?.raw.tagColor ?? 'default'
}

export function isMenuType(menuType: MenuTypeInput, kind: MenuTypeKind) {
  return getMenuTypeItem(menuType)?.raw.kind === kind
}

export function isParentMenuSelectable(
  currentMenuType: MenuTypeInput,
  parentMenuType: MenuTypeInput,
) {
  if (!currentMenuType || !parentMenuType) {
    return false
  }

  if (currentMenuType === MenuTypeEnum.Button) {
    return parentMenuType === MenuTypeEnum.Menu
  }

  return parentMenuType === MenuTypeEnum.Dir
}
