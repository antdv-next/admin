# Query List And CRUD

本仓库的后台查询列表 + CRUD 页面，优先沿用 `apps/admin/pages/system/menu` 这套实现方式。

适用场景：

- 顶部查询表单 + 表格列表
- 新增 / 编辑使用 `Modal + Form`
- 删除使用行内 `Popconfirm`
- 列表、详情、保存、删除都先接 `mock`

## 推荐目录结构

以菜单页为例：

- 列表页：
  [`apps/admin/pages/system/menu/index.vue`](../../../../apps/admin/pages/system/menu/index.vue)
- 弹窗表单：
  [`apps/admin/pages/system/menu/components/menu-modal.vue`](../../../../apps/admin/pages/system/menu/components/menu-modal.vue)
- 页面工具：
  [`apps/admin/pages/system/menu/utils.ts`](../../../../apps/admin/pages/system/menu/utils.ts)
- API 封装：
  [`apps/admin/api/system/menu.ts`](../../../../apps/admin/api/system/menu.ts)
- Mock：
  [`mock/admin/system/menu.ts`](../../../../mock/admin/system/menu.ts)
- 页面测试：
  [`apps/admin/pages/system/menu/__tests__/utils.spec.ts`](../../../../apps/admin/pages/system/menu/__tests__/utils.spec.ts)
- Mock / 请求层测试：
  [`mock/admin/system/__tests__/menu.spec.ts`](../../../../mock/admin/system/__tests__/menu.spec.ts)
  [`src/utils/request/__tests__/alova.spec.ts`](../../../../src/utils/request/__tests__/alova.spec.ts)

## 一、查询列表页

列表页建议收敛成这几个职责：

- `reactive` 查询条件对象
- `usePagination` 负责分页请求和刷新
- `columns` 只描述列配置和展示行为
- `handleModal` 只负责打开新增 / 编辑弹窗
- `handleDelete` 只负责删除当前行并刷新列表

当前菜单页模式：

- 查询表单使用 `SearchFormGrid`
- 列表请求使用 `usePagination((page, pageSize) => getListMethod(page, pageSize, searchForm))`
- 删除请求单独使用 `useRequest(deleteMethod, { immediate: false })`
- 删除成功后调用 `refresh()`
- 弹窗成功后通过 `@success="refresh"` 回刷列表

### 查询表单建议

- 查询对象使用 `reactive<Partial<Entity>>()`
- 搜索按钮调用 `send({ ...searchForm })`
- 重置按钮直接走 `formRef?.resetFields?.()`

### 表格列建议

- 所有列统一设置 `minWidth`
- 操作列单独保留固定 `width`
- 状态 / 类型类字段统一在 `bodyCell` 中做格式化展示

## 二、Modal 表单 CRUD

弹窗表单建议拆成独立组件，不要把新增 / 编辑逻辑塞回列表页。

当前菜单弹窗模式：

- `v-model:open` 控制显示
- `props.type` 区分 `create | edit`
- `props.record` 只传当前行的基础信息
- 编辑态打开后，再调用详情接口拉完整数据
- 保存成功后关闭弹窗，并通过 `emit('success')` 通知父页面刷新

### 表单状态建议

- 使用 `initFormRecord()` 生成默认值
- 使用 `toMenuFormRecord()` 归一化接口数据，避免 `null` / 数字开关字段不稳定
- 关闭弹窗后在 `after-close` 里统一：
  - `formData.value = initFormRecord()`
  - `formRef.value?.resetFields?.()`

### 保存提交建议

- 不要手写分散校验
- 统一在保存方法里先 `await formRef.value?.validate()`
- 校验通过后再调用 `saveMethod`
- 成功提示由页面自己调用 `message.success`
- 失败提示交给全局请求层

## 三、API 层约定

当前菜单页 API 封装在：
[`apps/admin/api/system/menu.ts`](../../../../apps/admin/api/system/menu.ts)

建议把列表页 CRUD 接口收敛成 5 类：

- `getListMethod(page, pageSize, query)`
- `getInfoMethod(id)`
- `getOptionsMethod()` 或其他弹窗辅助数据接口
- `saveMethod(data)`
- `deleteMethod(id)`

菜单页当前接口：

- `POST /admin/system/menu`
- `GET /admin/system/menu/{id}`
- `GET /admin/system/menu/parent-options`
- `POST /admin/system/menu/save`
- `POST /admin/system/menu/delete`

注意：

- 请求层已经统一加了 `baseURL=/api`
- API 文件里写 `/admin/...` 即可，实际请求会走 `/api/admin/...`

## 四、Mock 层约定

当前菜单 mock 在：
[`mock/admin/system/menu.ts`](../../../../mock/admin/system/menu.ts)

建议 mock 至少覆盖：

- 列表查询
- 详情查询
- 下拉 / 树形辅助数据
- 保存
- 删除

### 动态参数写法

本项目 `@alova/mock` 动态路由参数语法不是 `:id`，而是 `{id}`。

正确写法：

```ts
'[GET]/admin/system/menu/{id}'({ params }) {
  const id = params.id
}
```

错误写法：

```ts
'[GET]/admin/system/menu/:id'
```

### 当前菜单 mock 的实现方式

- `menuStore` 使用 seed 克隆结果作为内存数据源
- `save` 支持新增和更新
- `delete` 直接按 `id` 删除当前内存数据
- `detail` 按 `params.id` 返回对应记录

如果页面后续要做本地完整联调，推荐都像菜单页这样把 mock 做成“可变内存数据”，而不是只返回死数据。

## 五、删除交互建议

删除按钮保持行内按钮，不单独跳详情页。

推荐方式：

- 外层使用 `a-popconfirm`
- `@confirm` 时调用删除方法
- `@cancel` 不做任何处理
- 删除中只给当前行按钮上 loading，不要锁全表

菜单页当前实现就是这个模式。

## 六、公共工具建议

页面级工具建议放在同目录 `utils.ts`，不要命名成 `data.ts`。

适合放进 `utils.ts` 的内容：

- 表单默认值生成
- 接口数据归一化
- 类型标签 / 文案映射
- 页面级选择规则

不适合放进 `utils.ts` 的内容：

- 请求调用
- 组件实例操作
- 页面事件处理

## 七、测试建议

这类页面至少补下面两类测试：

- 页面工具测试：
  比如 `utils.ts` 的类型映射、选择规则、数据归一化
- Mock / 请求层测试：
  确认 mock 路由、动态参数、保存删除行为真正可用

当前菜单页已经覆盖了：

- 动态路由 `{id}` 是否命中
- 父级树选项返回数据
- `save` / `delete` mock 是否生效

## 八、推荐实现顺序

做一个新的查询列表 + CRUD 页面时，建议按下面顺序推进：

1. 先定义 `api/*.ts`
2. 再补 `mock/*.ts`
3. 先写 mock / utils 测试
4. 实现列表页查询和表格展示
5. 实现 modal 新增 / 编辑
6. 实现行内删除确认
7. 最后补类型检查和联调验证

## 九、验证命令

- 定向测试：
  `pnpm vp test apps/admin/pages/<feature>/__tests__/*.spec.ts mock/**/__tests__/*.spec.ts`
- 类型检查：
  `pnpm exec vue-tsc -b --pretty false`
- 默认检查：
  `pnpm vp check`
