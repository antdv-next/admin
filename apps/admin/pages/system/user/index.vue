<script setup lang="ts">
import { DeleteOutlined, EditOutlined, ReloadOutlined, SettingOutlined } from '@antdv-next/icons'
import type { ColProps, FormInstance, TableProps } from 'antdv-next'
import { usePagination, useRequest } from 'alova/client'
import type { UserRecord } from '@/api/user'
import SearchFormGrid from '@/components/search-form-grid/index.vue'
import SearchFormGridItem from '@/components/search-form-grid/item.vue'
import { useApp } from '@/composables/app'
import { deleteUserRecordMethod, getUserListMethod } from '@apps/admin/api/system/user'
import UserModal from './components/user-modal.vue'
import {
  getUserSexLabel,
  getUserStatusLabel,
  getUserStatusTagColor,
  userStatusOptions,
} from './utils'

defineOptions({ name: 'AdminSystemUserPage' })

definePage({
  meta: {
    title: '用户管理',
  },
})

const { message } = useApp()
const formColProps: ColProps = {
  xs: 24,
  md: 24,
  sm: 24,
  lg: 12,
  xl: 8,
  xxl: 6,
  xxxl: 6,
}
const searchForm = reactive<Partial<UserRecord>>({
  username: '',
  nickname: '',
  realName: '',
  userPhone: '',
  userStatus: undefined,
})

const { loading, data, total, pageSize, page, send, refresh } = usePagination(
  (page, pageSize) => getUserListMethod(page, pageSize, searchForm),
  {
    total: response => response.data?.total,
    data: response => response.data?.list,
    initialPage: 1,
    initialPageSize: 10,
  },
)

const handlePageChange = (p: number, ps: number) => {
  page.value = p
  pageSize.value = ps
}

const formRef = shallowRef<FormInstance>()
const handleSearch = () => {
  send({ ...searchForm })
}

const { send: deleteUser, loading: deleteLoading } = useRequest(deleteUserRecordMethod, {
  immediate: false,
})
const deletingId = shallowRef<UserRecord['id']>()

const columns: TableProps['columns'] = [
  {
    dataIndex: 'username',
    minWidth: 100,
    title: '用户名',
  },
  {
    dataIndex: 'nickname',
    minWidth: 100,
    title: '昵称',
  },
  {
    dataIndex: 'realName',
    minWidth: 100,
    title: '真实姓名',
  },
  {
    dataIndex: 'userPhone',
    minWidth: 100,
    title: '手机号',
  },
  {
    dataIndex: 'userEmail',
    minWidth: 100,
    title: '邮箱',
  },
  {
    dataIndex: 'userSex',
    minWidth: 100,
    title: '性别',
  },
  {
    dataIndex: 'userStatus',
    minWidth: 100,
    title: '状态',
  },
  {
    dataIndex: 'action',
    title: '操作列',
    minWidth: 100,
    width: 120,
    align: 'center',
  },
]

type ModalType = 'create' | 'edit'
const open = shallowRef(false)
const modalType = shallowRef<ModalType>('create')
const editingRecord = shallowRef<UserRecord>()

const handleModal = (type: ModalType, record?: UserRecord) => {
  modalType.value = type
  open.value = true
  editingRecord.value = record
}

const handleDelete = async (record: UserRecord) => {
  const id = record.id
  if (!id) {
    return
  }

  deletingId.value = id

  try {
    await deleteUser(id)
    message.success('删除成功')
    await refresh()
  } catch {
    // Global request layer already reports the error message.
  } finally {
    deletingId.value = undefined
  }
}
</script>

<template>
  <page-container>
    <div class="bg-container mx-4 rounded px-4 py-4">
      <a-form layout="inline" name="searchForm" ref="formRef" @submit="handleSearch">
        <search-form-grid :item-col-props="formColProps">
          <search-form-grid-item>
            <a-form-item label="用户名" name="username">
              <a-input v-model:value="searchForm.username" placeholder="请输入" allow-clear />
            </a-form-item>
          </search-form-grid-item>
          <search-form-grid-item>
            <a-form-item label="昵称" name="nickname">
              <a-input v-model:value="searchForm.nickname" placeholder="请输入" allow-clear />
            </a-form-item>
          </search-form-grid-item>
          <search-form-grid-item>
            <a-form-item label="真实姓名" name="realName">
              <a-input v-model:value="searchForm.realName" placeholder="请输入" allow-clear />
            </a-form-item>
          </search-form-grid-item>
          <search-form-grid-item>
            <a-form-item label="手机号" name="userPhone">
              <a-input v-model:value="searchForm.userPhone" placeholder="请输入" allow-clear />
            </a-form-item>
          </search-form-grid-item>
          <search-form-grid-item>
            <a-form-item label="状态" name="userStatus">
              <a-select
                v-model:value="searchForm.userStatus"
                :options="userStatusOptions"
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

    <div class="bg-container mx-4 rounded px-4 pb-4">
      <a-table
        :columns="columns"
        :loading="loading"
        :data-source="data"
        :scroll="{ y: 500 }"
        :pagination="{
          total,
          pageSize,
          current: page,
          onChange: handlePageChange,
        }"
      >
        <template #title>
          <div class="flex justify-between items-center">
            <span class="text-lg font-bold">查询表格</span>
            <div class="flex items-center gap-2">
              <a-button type="primary" size="small" @click="handleModal('create')">新增</a-button>
              <a-divider vertical />
              <a-button type="text" size="small" :loading="loading" @click="() => refresh()">
                <template #icon>
                  <ReloadOutlined />
                </template>
              </a-button>
              <a-button type="text" size="small">
                <template #icon>
                  <SettingOutlined />
                </template>
              </a-button>
            </div>
          </div>
        </template>
        <template #bodyCell="{ record, column }">
          <template v-if="column.dataIndex === 'realName'">
            {{ (record as UserRecord).realName || '-' }}
          </template>
          <template v-else-if="column.dataIndex === 'userPhone'">
            {{ (record as UserRecord).userPhone || '-' }}
          </template>
          <template v-else-if="column.dataIndex === 'userEmail'">
            {{ (record as UserRecord).userEmail || '-' }}
          </template>
          <template v-else-if="column.dataIndex === 'userSex'">
            {{ getUserSexLabel((record as UserRecord).userSex) }}
          </template>
          <template v-else-if="column.dataIndex === 'userStatus'">
            <a-tag :color="getUserStatusTagColor((record as UserRecord).userStatus)">
              {{ getUserStatusLabel((record as UserRecord).userStatus) }}
            </a-tag>
          </template>
          <template v-else-if="column.dataIndex === 'action'">
            <div class="inline-flex items-center gap-2">
              <a-button type="link" size="small" @click="handleModal('edit', record as UserRecord)">
                <template #icon>
                  <EditOutlined />
                </template>
              </a-button>
              <a-popconfirm
                title="确认删除当前数据？"
                ok-text="确认"
                cancel-text="取消"
                @confirm="handleDelete(record as UserRecord)"
              >
                <a-button
                  type="text"
                  size="small"
                  danger
                  :loading="deleteLoading && deletingId === (record as UserRecord).id"
                >
                  <template #icon>
                    <DeleteOutlined />
                  </template>
                </a-button>
              </a-popconfirm>
            </div>
          </template>
        </template>
      </a-table>
    </div>

    <UserModal v-model:open="open" :type="modalType" :record="editingRecord" @success="refresh" />
  </page-container>
</template>
