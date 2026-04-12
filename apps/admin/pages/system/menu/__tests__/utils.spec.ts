import { describe, expect, it } from 'vite-plus/test'
import { MENU_TYPE, MenuTypeEnum } from '@/constants/menu'
import { getMenuTypeLabel, isMenuType, isParentMenuSelectable, menuTypeOptions } from '../utils'

describe('system menu utils', () => {
  it('builds select options from MenuTypeEnum', () => {
    expect(menuTypeOptions).toEqual(MenuTypeEnum.items)
    expect(MenuTypeEnum.values).toEqual([MENU_TYPE.DIR, MENU_TYPE.MENU, MENU_TYPE.BUTTON])
  })

  it('maps menu type values to labels', () => {
    expect(getMenuTypeLabel(MENU_TYPE.DIR)).toBe('目录')
    expect(getMenuTypeLabel(MENU_TYPE.MENU)).toBe('菜单')
    expect(getMenuTypeLabel(MENU_TYPE.BUTTON)).toBe('按钮')
    expect(getMenuTypeLabel('unknown')).toBeUndefined()
  })

  it('checks menu type by enum value', () => {
    expect(isMenuType(MENU_TYPE.DIR, 'dir')).toBe(true)
    expect(isMenuType(MENU_TYPE.MENU, 'menu')).toBe(true)
    expect(isMenuType(MENU_TYPE.BUTTON, 'btn')).toBe(true)
    expect(isMenuType(MENU_TYPE.BUTTON, 'dir')).toBe(false)
    expect(isMenuType(undefined, 'menu')).toBe(false)
  })

  it('matches parent selection rules by menu type', () => {
    expect(isParentMenuSelectable(MENU_TYPE.DIR, MENU_TYPE.DIR)).toBe(true)
    expect(isParentMenuSelectable(MENU_TYPE.DIR, MENU_TYPE.MENU)).toBe(false)
    expect(isParentMenuSelectable(MENU_TYPE.MENU, MENU_TYPE.DIR)).toBe(true)
    expect(isParentMenuSelectable(MENU_TYPE.MENU, MENU_TYPE.MENU)).toBe(false)
    expect(isParentMenuSelectable(MENU_TYPE.BUTTON, MENU_TYPE.DIR)).toBe(false)
    expect(isParentMenuSelectable(MENU_TYPE.BUTTON, MENU_TYPE.MENU)).toBe(true)
    expect(isParentMenuSelectable(MENU_TYPE.BUTTON, MENU_TYPE.BUTTON)).toBe(false)
  })
})
