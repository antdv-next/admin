import { describe, expect, it } from 'vite-plus/test'
import { MENU_TYPE, MenuTypeEnum } from '@/constants/menu'
import { getMenuTypeLabel, isMenuType, menuTypeOptions } from '../data'

describe('system menu enum data', () => {
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
})
