import { describe, expect, it } from 'vite-plus/test'
import { MENU_TYPE } from '@/constants/menu'
import {
  createPermissionTypeSource,
  extractMenuPermissions,
  extractPermissionCodes,
} from '@/utils/permission'

describe('permission utils', () => {
  it('extracts unique permission codes from button menus', () => {
    const codes = extractMenuPermissions([
      {
        id: 'menu-1',
        menuType: MENU_TYPE.MENU,
        permission: 'system:user:view',
      },
      {
        id: 'btn-1',
        menuType: MENU_TYPE.BUTTON,
        permission: 'system:user:create',
      },
      {
        id: 'btn-2',
        menuType: MENU_TYPE.BUTTON,
        code: 'system:user:update',
      },
      {
        id: 'btn-3',
        menuType: MENU_TYPE.BUTTON,
        permission: 'system:user:create',
      },
    ] as any)

    expect(codes).toEqual(['system:user:create', 'system:user:update'])
  })

  it('extracts unique permission codes from generator source items', () => {
    const codes = extractPermissionCodes([
      'system:user:create',
      { permission: 'system:user:update' },
      { code: 'system:user:remove' },
      { permission: 'system:user:update' },
      { permission: null },
    ])

    expect(codes).toEqual(['system:user:create', 'system:user:remove', 'system:user:update'])
  })

  it('creates a generated permission type file with string fallback', () => {
    const source = createPermissionTypeSource(['system:user:create', 'system:user:update'])

    expect(source).toContain("type KnownPerCodeType = 'system:user:create' | 'system:user:update'")
    expect(source).toContain('type PerCodeType = KnownPerCodeType | (string & {})')
    expect(source).toContain('export type PerCodeType = globalThis.PerCodeType')
  })
})
