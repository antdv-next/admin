<script setup lang="ts">
import { DeleteOutlined, EditOutlined, ReloadOutlined, SettingOutlined } from '@antdv-next/icons'
import type { ColProps, FormInstance, TableProps } from 'antdv-next'
import { usePagination, useRequest } from 'alova/client'
import type { ConfigInfo } from '@/api/config'
import SearchFormGrid from '@/components/search-form-grid/index.vue'
import SearchFormGridItem from '@/components/search-form-grid/item.vue'
import { useApp } from '@/composables/app'
import { deleteConfigMethod, getConfigListMethod } from '@apps/admin/api/system/config'
import ConfigModal from './components/config-modal.vue'
import { getConfigSourceLabel } from './utils'

defineOptions({ name: 'AdminSystemConfigPage' })

definePage({
  meta: {
    title: '配置管理',
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
const searchForm = reactive<Partial<ConfigInfo>>({
  configKey: '',
  configName: '',
  configType: '',
})

const { loading, data, total, pageSize, page, send, refresh } = usePagination(
  (page, pageSize) => getConfigListMethod(page, pageSize, searchForm),
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

const { send: deleteConfig, loading: deleteLoading } = useRequest(deleteConfigMethod, {
  immediate: false,
})
const deletingId = shallowRef<ConfigInfo['id']>()

const columns: TableProps['columns'] = [
  {
    dataIndex: 'configName',
    minWidth: 100,
    title: '配置名称',
  },
  {
    dataIndex: 'configKey',
    minWidth: 100,
    title: '配置键',
  },
  {
    dataIndex: 'configType',
    minWidth: 100,
    title: '配置分类',
  },
  {
    dataIndex: 'configSource',
    minWidth: 100,
    title: '配置来源',
  },
  {
    dataIndex: 'configValue',
    minWidth: 100,
    title: '配置值',
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
const editingRecord = shallowRef<ConfigInfo>()

const handleModal = (type: ModalType, record?: ConfigInfo) => {
  modalType.value = type
  open.value = true
  editingRecord.value = record
}

const handleDelete = async (record: ConfigInfo) => {
  const id = record.id
  if (!id) {
    return
  }

  deletingId.value = id

  try {
    await deleteConfig(id)
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
            <a-form-item label="配置名称" name="configName">
              <a-input v-model:value="searchForm.configName" placeholder="请输入" allow-clear />
            </a-form-item>
          </search-form-grid-item>
          <search-form-grid-item>
            <a-form-item label="配置键" name="configKey">
              <a-input v-model:value="searchForm.configKey" placeholder="请输入" allow-clear />
            </a-form-item>
          </search-form-grid-item>
          <search-form-grid-item>
            <a-form-item label="配置分类" name="configType">
              <a-input v-model:value="searchForm.configType" placeholder="请输入" allow-clear />
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
          <template v-if="column.dataIndex === 'configSource'">
            {{ getConfigSourceLabel((record as ConfigInfo).configSource) }}
          </template>
          <template v-else-if="column.dataIndex === 'configValue'">
            {{ (record as ConfigInfo).configValue || '-' }}
          </template>
          <template v-else-if="column.dataIndex === 'action'">
            <div class="inline-flex items-center gap-2">
              <a-button type="link" size="small" @click="handleModal('edit', record as ConfigInfo)">
                <template #icon>
                  <EditOutlined />
                </template>
              </a-button>
              <a-popconfirm
                title="确认删除当前数据？"
                ok-text="确认"
                cancel-text="取消"
                @confirm="handleDelete(record as ConfigInfo)"
              >
                <a-button
                  type="text"
                  size="small"
                  danger
                  :loading="deleteLoading && deletingId === (record as ConfigInfo).id"
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

    <ConfigModal v-model:open="open" :type="modalType" :record="editingRecord" @success="refresh" />
  </page-container>
</template>
