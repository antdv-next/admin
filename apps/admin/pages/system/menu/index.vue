<script setup lang="ts">
import { SettingOutlined, ReloadOutlined } from '@antdv-next/icons'
import type { ColProps, FormInstance, SelectProps, TableProps } from 'antdv-next'
import type { MenuInfo } from '@/api/menu'
import SearchFormGrid from '@/components/search-form-grid/index.vue'
import SearchFormGridItem from '@/components/search-form-grid/item.vue'

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
  name: '',
  menuType: '',
})

const menuTypeOptions: SelectProps['options'] = [
  {
    label: '目录',
    value: 'menu_type_dir',
  },
  {
    label: '菜单',
    value: 'menu_type_menu',
  },
]

const formRef = shallowRef<FormInstance>()
const handleSearch = () => {
  console.log(searchForm)
}

const columns: TableProps['columns'] = [
  {
    dataIndex: 'name',
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
    dataIndex: 'action',
    title: '操作列',
  },
]
</script>

<template>
  <page-container>
    <div class="bg-container mx-4 rounded px-4 py-4">
      <a-form layout="inline" name="searchForm" ref="formRef" @submit="handleSearch">
        <search-form-grid :item-col-props="formColProps">
          <search-form-grid-item>
            <a-form-item label="菜单名称" name="name">
              <a-input v-model:value="searchForm.name" placeholder="请输入" allow-clear />
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
      <a-table :columns="columns">
        <template #title>
          <div class="flex justify-between items-center">
            <span class="text-lg font-bold">查询表格</span>
            <div class="flex items-center gap-2">
              <a-button type="text" size="small">
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
        </template>
      </a-table>
    </div>
  </page-container>
</template>
