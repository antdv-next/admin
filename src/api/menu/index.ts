export interface MenuInfo {
  // 菜单ID
  id: string
  // 菜单名称
  name: string
  // 菜单路径
  path: string
  // 菜单图标
  icon?: string
  // 父级id
  parentId?: string | null
  // 多应用标识，对应我们前端的多应用配置
  app?: string
  // 显示排序（越小越靠前）
  order?: number
  // 是否隐藏菜单（隐藏仅影响展示，不影响可访问策略）
  hidden?: boolean
}
