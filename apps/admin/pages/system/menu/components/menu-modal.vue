<script setup lang="ts">
import { useRequest } from 'alova/client'
import type { MenuInfo } from '@/api/menu'
import { getMenuInfoMethod } from '@apps/admin/api/system/menu.ts'
import { getMenuTypeLabel, isMenuType, menuTypeOptions } from '../data'

defineOptions({
  name: 'MenuModal',
})

const props = defineProps<{
  type?: 'create' | 'edit'
  record?: MenuInfo
}>()
const open = defineModel('open', {
  type: Boolean,
  default: false,
})

const { send, loading } = useRequest(getMenuInfoMethod, {
  immediate: false,
})

const record = ref({} as MenuInfo)
watch(
  () => props.record,
  () => {
    if (props.type === 'edit') {
      const id = props?.record?.id as string
      if (id) {
        send(id)
      }
    }
  },
  {
    immediate: true,
  },
)

const getLabelName = (title: string, type?: string | null) => {
  if (!type) return title
  const label = getMenuTypeLabel(type)
  return label ? `${label}${title}` : title
}

const checkMenuType = (type?: 'btn' | 'dir' | 'menu') => {
  if (!type) return false

  return isMenuType(record.value.menuType, type)
}
</script>

<template>
  <a-modal
    v-model:open="open"
    :title="type === 'edit' ? '编辑菜单' : '菜单创建'"
    width="820px"
    :loading="loading"
  >
    <a-form :model="record" :label-col="{ style: { width: '100px' } }" class="mt-6">
      <a-row :gutter="[20, 20]">
        <a-col :span="12">
          <a-form-item label="类型" name="menuType">
            <a-select
              :options="menuTypeOptions"
              v-model:value="record.menuType"
              placeholder="请选择"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="getLabelName('名称', record.menuType)" name="title">
            <a-input v-model:value="record.title" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <template v-if="!checkMenuType('btn')">
          <a-col :span="12">
            <a-form-item label="多语言" name="locale">
              <a-input v-model:value="record.locale" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="图标" name="icon">
              <a-input v-model:value="record.icon" placeholder="请输入" />
            </a-form-item>
          </a-col>
        </template>
        <a-col :span="12" v-if="checkMenuType('btn')">
          <a-form-item label="权限标识" name="permission">
            <a-input v-model:value="record.permission" placeholder="system:user:create" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>
