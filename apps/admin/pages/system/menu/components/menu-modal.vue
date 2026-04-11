<script setup lang="ts">
import { useRequest } from 'alova/client'
import type { MenuInfo } from '@/api/menu'
import { getMenuInfoMethod } from '@apps/admin/api/system/menu.ts'
import {
  type MenuFormRecord,
  getMenuTypeLabel,
  initFormRecord,
  isMenuType,
  menuTypeOptions,
} from '../data'

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

const formData = ref<MenuFormRecord>(initFormRecord())
watch(
  () => props.record,
  () => {
    if (props.type === 'edit') {
      const id = props?.record?.id as string
      if (id) {
        send(id)
      }
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

// Conditional field visibility
const showUrl = computed(() => !!formData.value.target)
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
</script>

<template>
  <a-modal
    v-model:open="open"
    :title="type === 'edit' ? '编辑菜单' : '新增菜单'"
    width="860px"
    :loading="loading"
  >
    <a-form :model="formData" :label-col="{ style: { width: '90px' } }" class="mt-6">
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
            <a-form-item label="路由地址" name="path">
              <a-input v-model:value="formData.path" placeholder="/system/user" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="路由名称" name="name">
              <a-input v-model:value="formData.name" placeholder="SystemUser" />
            </a-form-item>
          </a-col>

          <!-- 组件路径：仅菜单 -->
          <a-col :span="24" v-if="isMenu">
            <a-form-item label="组件路径" name="component">
              <a-input v-model:value="formData.component" placeholder="system/user/index" />
            </a-form-item>
          </a-col>

          <!-- 重定向：仅目录 -->
          <a-col :span="24" v-if="isDir">
            <a-form-item label="重定向" name="redirect">
              <a-input v-model:value="formData.redirect" placeholder="请输入重定向地址" />
            </a-form-item>
          </a-col>

          <!-- 打开方式 + 链接地址 -->
          <a-col :span="12">
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
