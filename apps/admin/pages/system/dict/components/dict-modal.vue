<script setup lang="ts">
import type { FormInstance } from 'antdv-next'
import { useRequest } from 'alova/client'
import type { DictInfo } from '@/api/dict'
import { useApp } from '@/composables/app'
import { toTreeSelectData } from '@/utils/to-tree'
import {
  getDictInfoMethod,
  getDictParentOptionsMethod,
  saveDictMethod,
  type DictParentOption,
} from '@apps/admin/api/system/dict'
import {
  type DictFormRecord,
  dictSourceOptions,
  dictStatusOptions,
  initFormRecord,
  toDictFormRecord,
} from '../utils'

const props = defineProps<{
  type?: 'create' | 'edit'
  record?: DictInfo
}>()
const emit = defineEmits<{
  success: []
}>()
const open = defineModel('open', {
  type: Boolean,
  default: false,
})
const { message } = useApp()

const { send, loading: infoLoading } = useRequest(getDictInfoMethod, {
  immediate: false,
})
const { send: saveDict, loading: saveLoading } = useRequest(saveDictMethod, {
  immediate: false,
})
const { data: parentOptionsResponse, loading: parentLoading } = useRequest(
  getDictParentOptionsMethod,
  {
    initialData: {
      code: 200,
      data: [] as DictParentOption[],
      msg: 'success',
    },
  },
)

const formRef = shallowRef<FormInstance>()
const formData = ref<DictFormRecord>(initFormRecord())

watch(
  [() => open.value, () => props.type, () => props.record?.id],
  async ([isOpen, type, id]) => {
    if (!isOpen) {
      return
    }

    if (type === 'edit' && id) {
      const response = await send(id)
      if (!open.value) {
        return
      }
      formData.value = toDictFormRecord(response.data)
    } else {
      formData.value = initFormRecord()
    }
  },
  { immediate: true },
)

const parentTreeData = computed(() =>
  toTreeSelectData(parentOptionsResponse.value.data ?? [], {
    getDisabled: item => item.id === formData.value.id,
    getId: item => item.id,
    getParentId: item => item.parentId,
    getSelectable: item => item.id !== formData.value.id,
    getSortValue: item => item.sort,
    getTitle: item => item.label ?? '-',
  }),
)

watch([() => formData.value.parentId, parentOptionsResponse], ([parentId, response]) => {
  if (!parentId) {
    return
  }

  const parent = response.data?.find(item => item.id === parentId)
  if (!parent || parent.id === formData.value.id) {
    formData.value.parentId = null
  }
})

const handleSave = async () => {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }

  try {
    await saveDict({ ...formData.value })
    message.success(props.type === 'edit' ? '更新成功' : '保存成功')
    open.value = false
    emit('success')
  } catch {
    // Global request layer already reports the error message.
  }
}

const handleAfterClose = () => {
  formData.value = initFormRecord()
  formRef.value?.resetFields?.()
}
</script>

<template>
  <a-modal
    v-model:open="open"
    :title="type === 'edit' ? '编辑字典' : '新增字典'"
    width="820px"
    ok-text="保存"
    :loading="infoLoading || parentLoading"
    :confirm-loading="saveLoading"
    :after-close="handleAfterClose"
    @ok="handleSave"
  >
    <a-form ref="formRef" :model="formData" :label-col="{ style: { width: '90px' } }" class="mt-6">
      <a-row :gutter="[20, 0]">
        <a-col :span="12">
          <a-form-item
            label="标签"
            name="label"
            :rules="[{ required: true, message: '请输入标签' }]"
          >
            <a-input v-model:value="formData.label" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="编码"
            name="code"
            :rules="[{ required: true, message: '请输入编码' }]"
          >
            <a-input v-model:value="formData.code" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="值" name="value">
            <a-input v-model:value="formData.value" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="上级字典" name="parentId">
            <a-tree-select
              v-model:value="formData.parentId"
              :tree-data="parentTreeData"
              allow-clear
              placeholder="请选择上级字典"
              tree-default-expand-all
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="排序" name="sort">
            <a-input-number
              v-model:value="formData.sort"
              :min="0"
              placeholder="请输入"
              class="w-full"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="状态" name="dictStatus">
            <a-select
              v-model:value="formData.dictStatus"
              :options="dictStatusOptions"
              placeholder="请选择"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="来源" name="dictSource">
            <a-select
              v-model:value="formData.dictSource"
              :options="dictSourceOptions"
              placeholder="请选择"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="备注" name="remark">
            <a-input v-model:value="formData.remark" placeholder="请输入" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>
