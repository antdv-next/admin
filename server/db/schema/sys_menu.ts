import {
  index,
  integer,
  pgTable,
  smallint,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';
import { v7 as uuidv7 } from 'uuid';

export const sysMenu = pgTable(
  'sys_menu',
  {
    // 主键 ID
    id: varchar('id', { length: 36 })
      .primaryKey()
      .$defaultFn(() => uuidv7()),
    // 租户 ID，预留字段；暂不建立租户表或外键关联
    tenantId: varchar('tenant_id', { length: 36 })
      .notNull()
      .default('00000000-0000-0000-0000-000000000000'),
    // 父级ID
    parentId: varchar('parent_id', { length: 36 }),
    // 类型: 1目录 2菜单 3按钮
    menuType: smallint('menu_type').notNull().default(1),
    // 菜单名称
    menuName: varchar('menu_name', { length: 64 }).notNull(),
    //  菜单编码
    menuCode: varchar('menu_code', { length: 64 }).notNull(),
    // 路由名称
    routeName: varchar('route_name', { length: 64 }),
    // 路由路径
    routePath: varchar('route_path', { length: 64 }),
    // 组件路径地址
    component: varchar('component', { length: 64 }),
    // 权限标识 如: system:user:add
    permissionCode: varchar('permission_code', { length: 32 }),
    // 图标
    icon: varchar('icon', { length: 32 }),
    // 配置菜单是否隐藏 是否显示：1显示 0隐藏
    visible: smallint('visible').default(1),
    // 状态配置 1启用 0禁用
    status: smallint('status').default(1),
    // 是否缓存 1启用 0禁用，预留字段，这个版本可能不考虑缓存的问题，因为是嵌套菜单，无法正常考虑缓存的问题
    keepAlive: smallint('keepAlive').default(0),
    // 排序 数字越大越靠前
    sort: integer('sort').notNull().default(0),
    // 备注
    remark: varchar('remark', { length: 255 }),
    // 创建人
    createdBy: varchar('created_by', { length: 36 }),
    // 创建人名称
    createdByName: varchar('created_by_name', { length: 64 }),
    // 更新人
    updatedBy: varchar('updated_by', { length: 36 }),
    // 更新人名称
    updatedByName: varchar('updated_by_name', { length: 64 }),
    // 创建时间
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    // 更新时间
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
    // 逻辑删除：1 已删除，0 未删除
    isDeleted: smallint('is_deleted').notNull().default(0),
    // 乐观锁版本号
    version: integer('version').notNull().default(0),
  },
  (table) => [
    // 设置租户相关的索引，支持未来多租户场景
    uniqueIndex('uk_tenant_menu_code').on(table.tenantId, table.menuCode),
    index('idx_tenant_menu_parent').on(table.tenantId, table.parentId),
    index('idx_tenant_menu_type_status').on(table.tenantId, table.menuType, table.status),
  ],
);
