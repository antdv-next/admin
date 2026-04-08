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
    width="520px"
    :loading="loading"
  >
    <a-form :model="record" layout="vertical">
      <a-form-item label="菜单名称" name="title">
        <a-input v-model:value="record.title" placeholder="请输入" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style scoped></style>
