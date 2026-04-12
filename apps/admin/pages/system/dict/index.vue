<script setup lang="ts">
import { DeleteOutlined, EditOutlined, ReloadOutlined, SettingOutlined } from '@antdv-next/icons'
import type { ColProps, FormInstance, TableProps } from 'antdv-next'
import { usePagination, useRequest } from 'alova/client'
import type { DictInfo } from '@/api/dict'
import SearchFormGrid from '@/components/search-form-grid/index.vue'
import SearchFormGridItem from '@/components/search-form-grid/item.vue'
import { useApp } from '@/composables/app'
import { deleteDictMethod, getDictListMethod } from '@apps/admin/api/system/dict'
import DictModal from './components/dict-modal.vue'
import {
  dictSourceOptions,
  getDictSourceLabel,
  getDictStatusLabel,
  getDictStatusTagColor,
} from './utils'

defineOptions({ name: 'AdminSystemDictPage' })

definePage({
  meta: {
    title: '字典管理',
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
const searchForm = reactive<Partial<DictInfo>>({
  label: '',
  value: '',
  code: '',
  dictSource: undefined,
})

const { loading, data, total, pageSize, page, send, refresh } = usePagination(
  (page, pageSize) => getDictListMethod(page, pageSize, searchForm),
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

const { send: deleteDict, loading: deleteLoading } = useRequest(deleteDictMethod, {
  immediate: false,
})
const deletingId = shallowRef<DictInfo['id']>()

const columns: TableProps['columns'] = [
  {
    dataIndex: 'label',
    minWidth: 100,
    title: '标签',
  },
  {
    dataIndex: 'value',
    minWidth: 100,
    title: '值',
  },
  {
    dataIndex: 'code',
    minWidth: 100,
    title: '编码',
  },
  {
    dataIndex: 'sort',
    minWidth: 100,
    title: '排序',
  },
  {
    dataIndex: 'dictStatus',
    minWidth: 100,
    title: '状态',
  },
  {
    dataIndex: 'dictSource',
    minWidth: 100,
    title: '来源',
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
const editingRecord = shallowRef<DictInfo>()

const handleModal = (type: ModalType, record?: DictInfo) => {
  modalType.value = type
  open.value = true
  editingRecord.value = record
}

const handleDelete = async (record: DictInfo) => {
  const id = record.id
  if (!id) {
    return
  }

  deletingId.value = id

  try {
    await deleteDict(id)
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
            <a-form-item label="标签" name="label">
              <a-input v-model:value="searchForm.label" placeholder="请输入" allow-clear />
            </a-form-item>
          </search-form-grid-item>
          <search-form-grid-item>
            <a-form-item label="值" name="value">
              <a-input v-model:value="searchForm.value" placeholder="请输入" allow-clear />
            </a-form-item>
          </search-form-grid-item>
          <search-form-grid-item>
            <a-form-item label="编码" name="code">
              <a-input v-model:value="searchForm.code" placeholder="请输入" allow-clear />
            </a-form-item>
          </search-form-grid-item>
          <search-form-grid-item>
            <a-form-item label="来源" name="dictSource">
              <a-select
                v-model:value="searchForm.dictSource"
                :options="dictSourceOptions"
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
          <template v-if="column.dataIndex === 'value'">
            {{ (record as DictInfo).value || '-' }}
          </template>
          <template v-else-if="column.dataIndex === 'dictStatus'">
            <a-tag :color="getDictStatusTagColor((record as DictInfo).dictStatus)">
              {{ getDictStatusLabel((record as DictInfo).dictStatus) }}
            </a-tag>
          </template>
          <template v-else-if="column.dataIndex === 'dictSource'">
            {{ getDictSourceLabel((record as DictInfo).dictSource) }}
          </template>
          <template v-else-if="column.dataIndex === 'action'">
            <div class="inline-flex items-center gap-2">
              <a-button type="link" size="small" @click="handleModal('edit', record as DictInfo)">
                <template #icon>
                  <EditOutlined />
                </template>
              </a-button>
              <a-popconfirm
                title="确认删除当前数据？"
                ok-text="确认"
                cancel-text="取消"
                @confirm="handleDelete(record as DictInfo)"
              >
                <a-button
                  type="text"
                  size="small"
                  danger
                  :loading="deleteLoading && deletingId === (record as DictInfo).id"
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

    <DictModal v-model:open="open" :type="modalType" :record="editingRecord" @success="refresh" />
  </page-container>
</template>
