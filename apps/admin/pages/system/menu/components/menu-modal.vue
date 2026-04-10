<script setup lang="ts">
import { useRequest } from 'alova/client'
import type { MenuInfo } from '@/api/menu'
import { getMenuInfoMethod } from '@apps/admin/api/system/menu.ts'

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
</script>

<template>
  <a-modal
    v-model:open="open"
    :title="type === 'edit' ? '编辑菜单' : '菜单创建'"
    width="820px"
    :loading="loading"
  >
    <a-form :model="record">
      <a-row :gutter="[20, 20]">
        <a-col :span="12">
          <a-form-item label="菜单名称" name="title">
            <a-input v-model:value="record.title" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="菜单多语言" name="locale">
            <a-input v-model:value="record.locale" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="图标" name="icon">
            <a-input v-model:value="record.icon" placeholder="请输入" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<style scoped></style>
