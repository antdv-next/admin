<script setup lang="ts">
import type { ColProps, FormInstance, SelectProps } from 'antdv-next'
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

    <div>Table</div>
  </page-container>
</template>
