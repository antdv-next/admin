<script setup lang="ts">
import type { FormInstance } from 'antdv-next'
import { useRequest } from 'alova/client'
import type { RoleInfo } from '@/api/role'
import { useApp } from '@/composables/app'
import { getRoleInfoMethod, saveRoleMethod } from '@apps/admin/api/system/role'
import {
  dataScopeOptions,
  initFormRecord,
  roleStatusOptions,
  roleTypeOptions,
  type RoleFormRecord,
  toRoleFormRecord,
} from '../utils'

const props = defineProps<{
  type?: 'create' | 'edit'
  record?: RoleInfo
}>()
const emit = defineEmits<{
  success: []
}>()
const open = defineModel('open', {
  type: Boolean,
  default: false,
})
const { message } = useApp()

const { send, loading: infoLoading } = useRequest(getRoleInfoMethod, {
  immediate: false,
})
const { send: saveRole, loading: saveLoading } = useRequest(saveRoleMethod, {
  immediate: false,
})

const formRef = shallowRef<FormInstance>()
const formData = ref<RoleFormRecord>(initFormRecord())

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
      formData.value = toRoleFormRecord(response.data)
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
    await saveRole({ ...formData.value })
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
    :title="type === 'edit' ? '编辑角色' : '新增角色'"
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
            label="角色名称"
            name="roleName"
            :rules="[{ required: true, message: '请输入角色名称' }]"
          >
            <a-input v-model:value="formData.roleName" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="角色编码"
            name="code"
            :rules="[{ required: true, message: '请输入角色编码' }]"
          >
            <a-input v-model:value="formData.code" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="角色类型" name="roleType">
            <a-select
              v-model:value="formData.roleType"
              :options="roleTypeOptions"
              placeholder="请选择"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="数据范围" name="dataScope">
            <a-select
              v-model:value="formData.dataScope"
              :options="dataScopeOptions"
              placeholder="请选择"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="状态" name="roleStatus">
            <a-select
              v-model:value="formData.roleStatus"
              :options="roleStatusOptions"
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
