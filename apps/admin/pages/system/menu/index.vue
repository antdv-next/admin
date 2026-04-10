<script setup lang="ts">
import { SettingOutlined, ReloadOutlined, DeleteOutlined, EditOutlined } from '@antdv-next/icons'
import type { ColProps, FormInstance, TableProps } from 'antdv-next'
import { usePagination } from 'alova/client'
import type { MenuInfo } from '@/api/menu'
import SearchFormGrid from '@/components/search-form-grid/index.vue'
import SearchFormGridItem from '@/components/search-form-grid/item.vue'
import { getMenuListMethod } from '@apps/admin/api/system/menu'
import MenuModal from './components/menu-modal.vue'
import { menuTypeOptions } from './data'

defineOptions({ name: 'AdminSystemMenuPage' })

definePage({
  meta: {
    title: '菜单管理',
  },
})
const formColProps: ColProps = {
  xs: 24,
  md: 24,
  sm: 24,
  lg: 12,
  xl: 8,
  xxl: 6,
  xxxl: 6,
}
const searchForm = reactive<Partial<MenuInfo>>({
  title: '',
  menuType: 'menu_type_menu',
})

const { loading, data, total, pageSize, page, send, refresh } = usePagination(
  (page, pageSize) => getMenuListMethod(page, pageSize, searchForm),
  {
    total: response => response.data?.total,
    data: response => response.data?.list,
    initialPage: 1,
    initialPageSize: 10,
  },
)

const handlePageChange = (p: number, ps: number) => {
  page.value = p
  pageSize.value = ps
}

const formRef = shallowRef<FormInstance>()
const handleSearch = () => {
  send({ ...searchForm })
}

const columns: TableProps['columns'] = [
  {
    dataIndex: 'title',
    title: '菜单名称',
  },
  {
    dataIndex: 'menuType',
    title: '菜单类型',
  },
  {
    dataIndex: 'path',
    title: '路由路径',
  },
  {
    dataIndex: 'permission',
    title: '权限',
  },
  {
    dataIndex: 'action',
    title: '操作列',
    width: 120,
    align: 'center',
  },
]
type ModalType = 'create' | 'edit'
const open = shallowRef(false)
const modalType = shallowRef<ModalType>('create')
const editingRecord = shallowRef<MenuInfo>()
const handleModal = (type: ModalType, record?: MenuInfo) => {
  modalType.value = type
  open.value = true
  editingRecord.value = record
}
</script>

<template>
  <page-container>
    <div class="bg-container mx-4 rounded px-4 py-4">
      <a-form layout="inline" name="searchForm" ref="formRef" @submit="handleSearch">
        <search-form-grid :item-col-props="formColProps">
          <search-form-grid-item>
            <a-form-item label="菜单名称" name="title">
              <a-input v-model:value="searchForm.title" placeholder="请输入" allow-clear />
            </a-form-item>
          </search-form-grid-item>
          <search-form-grid-item>
            <a-form-item name="path" label="路由路径">
              <a-input v-model:value="searchForm.path" placeholder="请输入" allow-clear />
            </a-form-item>
          </search-form-grid-item>
          <search-form-grid-item>
            <a-form-item label="类型" name="menuType">
              <a-select
                :options="menuTypeOptions"
                v-model:value="searchForm.menuType"
                placeholder="请选择"
                allow-clear
              />
            </a-form-item>
          </search-form-grid-item>

          <template #actions>
            <a-button @click="() => formRef?.resetFields?.()">重置</a-button>
            <a-button html-type="submit" type="primary">搜索</a-button>
          </template>
        </search-form-grid>
      </a-form>
    </div>

    <div class="bg-container mx-4 rounded px-4 pb-4">
      <a-table
        :columns="columns"
        :loading="loading"
        :data-source="data"
        :scroll="{ y: 500 }"
        :pagination="{
          total,
          pageSize,
          current: page,
          onChange: handlePageChange,
        }"
      >
        <template #title>
          <div class="flex justify-between items-center">
            <span class="text-lg font-bold">查询表格</span>
            <div class="flex items-center gap-2">
              <a-button type="primary" size="small" @click="handleModal('create')">新增</a-button>
              <a-divider vertical />
              <a-button type="text" size="small" :loading="loading" @click="() => refresh()">
                <template #icon>
                  <ReloadOutlined />
                </template>
              </a-button>
              <a-button type="text" size="small">
                <template #icon>
                  <SettingOutlined />
                </template>
              </a-button>
            </div>
          </div>
        </template>
        <template #bodyCell="{ record, column }">
          <template v-if="column.dataIndex === 'menuType'">
            <template v-if="record.menuType === 'menu_type_dir'">
              <a-tag color="blue">目录</a-tag>
            </template>
            <template v-else-if="record.menuType === 'menu_type_btn'">
              <a-tag color="cyan">按钮</a-tag>
            </template>
            <template v-else>
              <a-tag color="success"> 菜单 </a-tag>
            </template>
          </template>
          <template v-else-if="column.dataIndex === 'path'">
            <template v-if="record.path">
              {{ record.path }}
            </template>
            <template v-else> - </template>
          </template>
          <template v-else-if="column.dataIndex === 'permission'">
            <template v-if="record.permission">
              {{ record.permission }}
            </template>
            <template v-else> - </template>
          </template>
          <template v-else-if="column.dataIndex === 'action'">
            <div class="inline-flex items-center gap-2">
              <a-button type="link" size="small" @click="handleModal('create', record as MenuInfo)">
                <template #icon>
                  <EditOutlined />
                </template>
              </a-button>
              <a-button type="text" size="small" danger>
                <template #icon>
                  <DeleteOutlined />
                </template>
              </a-button>
            </div>
          </template>
        </template>
      </a-table>
    </div>
    <MenuModal v-model:open="open" :type="modalType" :record="editingRecord" />
  </page-container>
</template>
