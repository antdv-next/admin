export const MENU_TYPE = {
  DIR: 'menu_type_dir',
  MENU: 'menu_type_menu',
  BUTTON: 'menu_type_btn',
} as const

export type MenuTypeValue = (typeof MENU_TYPE)[keyof typeof MENU_TYPE]
