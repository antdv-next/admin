import type { SelectProps } from 'antdv-next'
import type { MenuInfo } from '@/api/menu'
import { MenuTypeEnum, type MenuTypeKind } from '@/constants/menu'

type MenuTypeInput = MenuInfo['menuType'] | undefined

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
