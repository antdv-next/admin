import { bigint, boolean, pgSchema, smallint, text, timestamp, varchar } from 'drizzle-orm/pg-core'

const antdvBoot = pgSchema('antdv_boot')
import { v7 as uuidV7 } from 'uuid'

export const sysMenu = antdvBoot.table('sys_menu', {
  // 菜单ID
  id: varchar('id', { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidV7()),
  // 创建者id
  createId: varchar('create_id', { length: 36 }),
  // 创建者姓名
  createName: varchar('create_name', { length: 55 }),
  // 创建时间
  createTime: timestamp('create_time', { mode: 'date', precision: 6 }),
  // 更新人id
  updateId: varchar('update_id', { length: 36 }),
  // 更新人名称
  updateName: varchar('update_name', { length: 55 }),
  // 更新时间
  updateTime: timestamp('update_time', { mode: 'date', precision: 6 }),
  // 菜单编码
  code: varchar('code', { length: 55 }),
  // 伪删除（false未删除 true已删除）
  isDelete: boolean('is_delete').notNull().default(false),
  // 父菜单ID
  parentId: varchar('parent_id', { length: 36 }),
  // 父菜单路径
  parentPath: varchar('parent_path', { length: 200 }),
  // 显示顺序
  sort: bigint('sort', { mode: 'number' }),
  // 标题
  title: varchar('title', { length: 50 }),
  // 权限标识
  permission: text('permission'),
  // menu_type_dir目录 menu_type_menu菜单 menu_type_btn按钮
  menuType: varchar('menu_type', { length: 55 }),
  // 路由地址
  path: varchar('path', { length: 55 }),
  // 菜单图标
  icon: varchar('icon', { length: 100 }),
  // 组件路径
  component: varchar('component', { length: 255 }),
  // 国际化字段
  locale: varchar('locale', { length: 30 }),
  // 0正常 1禁用
  menuStatus: smallint('menu_status').default(0),
  // 哪些是固定页签
  affix: smallint('affix').default(0),
  // 重定向地址
  redirect: varchar('redirect', { length: 255 }),
  // 同路由中的name主要是用于保活的作用
  name: varchar('name', { length: 55 }),
  // 0显示 1隐藏
  hideInMenu: smallint('hide_in_menu').default(0),
  // 隐藏菜单时，点击当前菜单可使用父级key
  parentKeys: varchar('parent_keys', { length: 555 }),
  // iframe模式跳转地址，不能与path重复
  url: varchar('url', { length: 255 }),
  // 是否存在面包屑
  hideInBreadcrumb: smallint('hide_in_breadcrumb').default(0),
  // 是否需要显示所有的子菜单
  hideChildrenInMenu: smallint('hide_children_in_menu').default(0),
  // 是否保活
  keepAlive: smallint('keep_alive').default(0),
  // 全链接跳转模式
  target: varchar('target', { length: 55 }),
})

export type SysMenu = typeof sysMenu.$inferSelect
