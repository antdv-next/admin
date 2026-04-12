<script setup lang="ts">
import type { FormInstance } from 'antdv-next'
import { useRequest } from 'alova/client'
import type { UserRecord } from '@/api/user'
import { useApp } from '@/composables/app'
import { getUserRecordMethod, saveUserRecordMethod } from '@apps/admin/api/system/user'
import {
  initFormRecord,
  type UserFormRecord,
  toUserFormRecord,
  userSexOptions,
  userStatusOptions,
} from '../utils'

const props = defineProps<{
  type?: 'create' | 'edit'
  record?: UserRecord
}>()
const emit = defineEmits<{
  success: []
}>()
const open = defineModel('open', {
  type: Boolean,
  default: false,
})
const { message } = useApp()

const { send, loading: infoLoading } = useRequest(getUserRecordMethod, {
  immediate: false,
})
const { send: saveUser, loading: saveLoading } = useRequest(saveUserRecordMethod, {
  immediate: false,
})

const formRef = shallowRef<FormInstance>()
const formData = ref<UserFormRecord>(initFormRecord())

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
      formData.value = toUserFormRecord(response.data)
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
    await saveUser({ ...formData.value })
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
    :title="type === 'edit' ? '编辑用户' : '新增用户'"
    width="820px"
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
            label="用户名"
            name="username"
            :rules="[{ required: true, message: '请输入用户名' }]"
          >
            <a-input v-model:value="formData.username" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="昵称"
            name="nickname"
            :rules="[{ required: true, message: '请输入昵称' }]"
          >
            <a-input v-model:value="formData.nickname" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="真实姓名" name="realName">
            <a-input v-model:value="formData.realName" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="手机号" name="userPhone">
            <a-input v-model:value="formData.userPhone" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="邮箱"
            name="userEmail"
            :rules="[{ type: 'email', message: '请输入正确的邮箱地址' }]"
          >
            <a-input v-model:value="formData.userEmail" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="性别" name="userSex">
            <a-select
              v-model:value="formData.userSex"
              :options="userSexOptions"
              placeholder="请选择"
              allow-clear
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="状态" name="userStatus">
            <a-select
              v-model:value="formData.userStatus"
              :options="userStatusOptions"
              placeholder="请选择"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>
