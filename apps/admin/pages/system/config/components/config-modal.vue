<script setup lang="ts">
import type { FormInstance } from 'antdv-next'
import { useRequest } from 'alova/client'
import type { ConfigInfo } from '@/api/config'
import { useApp } from '@/composables/app'
import { getConfigInfoMethod, saveConfigMethod } from '@apps/admin/api/system/config'
import {
  type ConfigFormRecord,
  initFormRecord,
  toConfigFormRecord,
  configSourceOptions,
} from '../utils'

const props = defineProps<{
  type?: 'create' | 'edit'
  record?: ConfigInfo
}>()
const emit = defineEmits<{
  success: []
}>()
const open = defineModel('open', {
  type: Boolean,
  default: false,
})
const { message } = useApp()

const { send, loading: infoLoading } = useRequest(getConfigInfoMethod, {
  immediate: false,
})
const { send: saveConfig, loading: saveLoading } = useRequest(saveConfigMethod, {
  immediate: false,
})

const formRef = shallowRef<FormInstance>()
const formData = ref<ConfigFormRecord>(initFormRecord())

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
      formData.value = toConfigFormRecord(response.data)
    } else {
      formData.value = initFormRecord()
    }
  },
  { immediate: true },
)

const handleSave = async () => {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }

  try {
    await saveConfig({ ...formData.value })
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
    :title="type === 'edit' ? '编辑配置' : '新增配置'"
    width="760px"
    ok-text="保存"
    :loading="infoLoading"
    :confirm-loading="saveLoading"
    :after-close="handleAfterClose"
    @ok="handleSave"
  >
    <a-form ref="formRef" :model="formData" :label-col="{ style: { width: '90px' } }" class="mt-6">
      <a-row :gutter="[20, 0]">
        <a-col :span="12">
          <a-form-item
            label="配置名称"
            name="configName"
            :rules="[{ required: true, message: '请输入配置名称' }]"
          >
            <a-input v-model:value="formData.configName" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="配置键"
            name="configKey"
            :rules="[{ required: true, message: '请输入配置键' }]"
          >
            <a-input v-model:value="formData.configKey" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="配置分类" name="configType">
            <a-input v-model:value="formData.configType" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="配置来源"
            name="configSource"
            :rules="[{ required: true, message: '请选择配置来源' }]"
          >
            <a-select
              v-model:value="formData.configSource"
              :options="configSourceOptions"
              placeholder="请选择"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="配置值" name="configValue">
            <a-input v-model:value="formData.configValue" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="配置备注" name="sourceRemark">
            <a-input v-model:value="formData.sourceRemark" placeholder="请输入" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>
