import { Enum } from 'enum-plus'

const menuTypeInit = {
  Dir: {
    value: 'menu_type_dir',
    label: '目录',
    kind: 'dir',
    tagColor: 'blue',
  },
  Menu: {
    value: 'menu_type_menu',
    label: '菜单',
    kind: 'menu',
    tagColor: 'success',
  },
  Button: {
    value: 'menu_type_btn',
    label: '按钮',
    kind: 'btn',
    tagColor: 'cyan',
  },
} as const

export const MenuTypeEnum = Enum(menuTypeInit)

export const MENU_TYPE = {
  DIR: MenuTypeEnum.Dir,
  MENU: MenuTypeEnum.Menu,
  BUTTON: MenuTypeEnum.Button,
} as const

export type MenuTypeValue = typeof MenuTypeEnum.valueType
export type MenuTypeKind = (typeof menuTypeInit)[keyof typeof menuTypeInit]['kind']
