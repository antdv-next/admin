<script setup lang="ts">
import type { FormInstance } from 'antdv-next'
import { useRequest } from 'alova/client'
import type { MenuInfo } from '@/api/menu'
import { useApp } from '@/composables/app'
import { toTreeSelectData } from '@/utils/to-tree'
import {
  getMenuInfoMethod,
  getMenuParentOptionsMethod,
  saveMenuMethod,
  type MenuParentOption,
} from '@apps/admin/api/system/menu.ts'
import {
  type MenuFormRecord,
  getMenuTypeLabel,
  initFormRecord,
  isMenuType,
  isParentMenuSelectable,
  menuTypeOptions,
  toMenuFormRecord,
} from '../utils'

const props = defineProps<{
  type?: 'create' | 'edit'
  record?: MenuInfo
}>()
const emit = defineEmits<{
  success: []
}>()
const open = defineModel('open', {
  type: Boolean,
  default: false,
})
const { message } = useApp()

const { send, loading: infoLoading } = useRequest(getMenuInfoMethod, {
  immediate: false,
})
const { send: saveMenu, loading: saveLoading } = useRequest(saveMenuMethod, {
  immediate: false,
})
const { data: parentMenuResponse, loading: parentMenuLoading } = useRequest(
  getMenuParentOptionsMethod,
  {
    initialData: {
      code: 200,
      data: [] as MenuParentOption[],
      msg: 'success',
    },
  },
)

const formRef = shallowRef<FormInstance>()
const formData = ref<MenuFormRecord>(initFormRecord())

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
      formData.value = toMenuFormRecord(response.data)
    } else {
      formData.value = initFormRecord()
    }
  },
  { immediate: true },
)

// Derived menu type states
const isDir = computed(() => isMenuType(formData.value.menuType, 'dir'))
const isMenu = computed(() => isMenuType(formData.value.menuType, 'menu'))
const isBtn = computed(() => isMenuType(formData.value.menuType, 'btn'))
const isDirOrMenu = computed(() => isDir.value || isMenu.value)
const modalLoading = computed(() => infoLoading.value || parentMenuLoading.value)
const parentMenuTreeData = computed(() =>
  toTreeSelectData(parentMenuResponse.value.data ?? [], {
    getDisabled: item =>
      item.id === formData.value.id ||
      !isParentMenuSelectable(formData.value.menuType, item.menuType),
    getId: item => item.id,
    getParentId: item => item.parentId,
    getSelectable: item =>
      item.id !== formData.value.id &&
      isParentMenuSelectable(formData.value.menuType, item.menuType),
    getSortValue: item => item.sort,
    getTitle: item => item.title ?? '-',
  }),
)

// Conditional field visibility
const showTarget = computed(() => isMenu.value)
const showUrl = computed(() => showTarget.value && !!formData.value.target)
const showParentKeys = computed(() => formData.value.hideInMenu === 1)

const getLabelName = (title: string) => {
  const label = getMenuTypeLabel(formData.value.menuType)
  return label ? `${label}${title}` : title
}

const menuStatusOptions = [
  { label: '正常', value: 0 },
  { label: '禁用', value: 1 },
]

const targetOptions = [
  { label: '默认', value: '' },
  { label: '新标签页', value: '_blank' },
  { label: 'iframe 嵌入', value: 'iframe' },
]

const handleSave = async () => {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }

  try {
    await saveMenu({
      ...formData.value,
    })
    message.success(props.type === 'edit' ? '更新成功' : '保存成功')
    open.value = false
    emit('success')
  } catch {
    // Global request layer already reports the error message.
  }
}

watch(
  [() => formData.value.menuType, () => formData.value.parentId, parentMenuResponse],
  ([menuType, parentId, response]) => {
    if (!parentId) {
      return
    }

    const parentMenu = response.data?.find(item => item.id === parentId)
    if (!parentMenu) {
      formData.value.parentId = null
      return
    }

    if (!isParentMenuSelectable(menuType, parentMenu.menuType)) {
      formData.value.parentId = null
    }
  },
)

const handleAfterClose = () => {
  formData.value = initFormRecord()
  formRef.value?.resetFields?.()
}
</script>

<template>
  <a-modal
    v-model:open="open"
    :title="type === 'edit' ? '编辑菜单' : '新增菜单'"
    width="860px"
    ok-text="保存"
    :confirm-loading="saveLoading"
    :loading="modalLoading"
    :after-close="handleAfterClose"
    @ok="handleSave"
  >
    <a-form ref="formRef" :model="formData" :label-col="{ style: { width: '90px' } }" class="mt-6">
      <a-row :gutter="[20, 0]">
        <!-- 基本信息 -->
        <a-col :span="12">
          <a-form-item
            label="类型"
            name="menuType"
            :rules="[{ required: true, message: '请选择菜单类型' }]"
          >
            <a-select
              :options="menuTypeOptions"
              v-model:value="formData.menuType"
              placeholder="请选择"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            :label="getLabelName('名称')"
            name="title"
            :rules="[{ required: true, message: '请输入名称' }]"
          >
            <a-input v-model:value="formData.title" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="上级菜单" name="parentId">
            <a-tree-select
              v-model:value="formData.parentId"
              :tree-data="parentMenuTreeData"
              allow-clear
              placeholder="请选择上级菜单，不选则作为顶级节点"
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
          <a-form-item label="状态" name="menuStatus">
            <a-select
              :options="menuStatusOptions"
              v-model:value="formData.menuStatus"
              placeholder="请选择"
            />
          </a-form-item>
        </a-col>

        <!-- 目录 / 菜单 专属字段 -->
        <template v-if="isDirOrMenu">
          <a-col :span="12">
            <a-form-item label="图标" name="icon">
              <a-input v-model:value="formData.icon" placeholder="请输入图标名称" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="多语言" name="locale">
              <a-input v-model:value="formData.locale" placeholder="menu.system.user" />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="路由地址" name="path" tooltip="确保路由路径与文件路径一致">
              <a-input v-model:value="formData.path" placeholder="/system/user" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="路由名称" name="name">
              <a-input v-model:value="formData.name" placeholder="SystemUser" />
            </a-form-item>
          </a-col>

          <!-- 重定向：仅目录 -->
          <a-col :span="24" v-if="isDir">
            <a-form-item label="重定向" name="redirect">
              <a-input v-model:value="formData.redirect" placeholder="请输入重定向地址" />
            </a-form-item>
          </a-col>

          <!-- 打开方式 + 链接地址 -->
          <a-col :span="12" v-if="showTarget">
            <a-form-item label="打开方式" name="target">
              <a-select
                :options="targetOptions"
                v-model:value="formData.target"
                placeholder="默认"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col :span="12" v-if="showUrl">
            <a-form-item
              label="链接地址"
              name="url"
              :rules="[{ required: true, message: '请输入链接地址' }]"
            >
              <a-input v-model:value="formData.url" placeholder="https://..." />
            </a-form-item>
          </a-col>

          <!-- 隐藏菜单 + 选中父级 key -->
          <a-col :span="12">
            <a-form-item label="隐藏菜单" name="hideInMenu">
              <a-switch
                v-model:checked="formData.hideInMenu"
                :checked-value="1"
                :un-checked-value="0"
                checked-children="隐藏"
                un-checked-children="显示"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12" v-if="showParentKeys">
            <a-form-item label="选中父级" name="parentKeys">
              <a-input v-model:value="formData.parentKeys" placeholder="父级菜单 key" />
            </a-form-item>
          </a-col>

          <!-- 面包屑 -->
          <a-col :span="12">
            <a-form-item label="面包屑" name="hideInBreadcrumb">
              <a-switch
                v-model:checked="formData.hideInBreadcrumb"
                :checked-value="1"
                :un-checked-value="0"
                checked-children="隐藏"
                un-checked-children="显示"
              />
            </a-form-item>
          </a-col>

          <!-- 隐藏子菜单：仅目录 -->
          <a-col :span="12" v-if="isDir">
            <a-form-item label="子菜单" name="hideChildrenInMenu">
              <a-switch
                v-model:checked="formData.hideChildrenInMenu"
                :checked-value="1"
                :un-checked-value="0"
                checked-children="隐藏"
                un-checked-children="显示"
              />
            </a-form-item>
          </a-col>

          <!-- 页面缓存 + 固定标签页：仅菜单 -->
          <template v-if="isMenu">
            <a-col :span="12">
              <a-form-item label="页面缓存" name="keepAlive">
                <a-switch
                  v-model:checked="formData.keepAlive"
                  :checked-value="1"
                  :un-checked-value="0"
                  checked-children="启用"
                  un-checked-children="关闭"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="固定标签页" name="affix">
                <a-switch
                  v-model:checked="formData.affix"
                  :checked-value="1"
                  :un-checked-value="0"
                  checked-children="固定"
                  un-checked-children="不固定"
                />
              </a-form-item>
            </a-col>
          </template>
        </template>

        <!-- 按钮专属：权限标识 -->
        <a-col :span="12" v-if="isBtn">
          <a-form-item label="权限标识" name="permission">
            <a-input v-model:value="formData.permission" placeholder="system:user:create" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>
