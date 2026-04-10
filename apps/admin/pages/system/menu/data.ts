import type { SelectProps } from 'antdv-next'
export const menuTypeOptions: SelectProps['options'] = [
  {
    label: '目录',
    value: 'menu_type_dir',
  },
  {
    label: '菜单',
    value: 'menu_type_menu',
  },
  {
    label: '按钮',
    value: 'menu_type_btn',
  },
]
