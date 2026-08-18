<script setup lang="ts">
import { CloseOutlined, DownOutlined, ReloadOutlined } from '@antdv-next/icons'
import type { MenuEmits, MenuProps, TabsEmits, TabsProps } from 'antdv-next'
import { useUserStore } from '@/stores/user'
import { useAdminTabsStore } from '@apps/admin/stores/tabs'

defineOptions({
  name: 'DefaultTabBar',
})

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const tabsStore = useAdminTabsStore()

watch(
  () => route.fullPath,
  () => {
    tabsStore.syncActiveTab(route, userStore.menus)
  },
  { immediate: true },
)

// 切换账号或退出登录时清空标签，避免带着上一个用户的页面标签
watch(
  () => userStore.token,
  () => {
    tabsStore.$reset()
  },
)

const tabItems = computed(
  () =>
    tabsStore.tabs.map(tab => ({
      closable: !tab.affix,
      key: tab.path,
      label: tab.title,
    })) as TabsProps['items'],
)

const activeTab = computed(() => tabsStore.tabs.find(tab => tab.path === route.path))

const handleChange: TabsEmits['change'] = key => {
  const tab = tabsStore.tabs.find(item => item.path === key)
  const targetPath = tab?.fullPath ?? String(key)
  if (targetPath !== route.fullPath) {
    router.push(targetPath)
  }
}

const handleEdit: TabsEmits['edit'] = (key, action) => {
  if (action !== 'remove' || typeof key !== 'string') {
    return
  }
  closeTab(key)
}

function closeTab(path: string) {
  const nextActivePath = tabsStore.closeTab(path, route.path)
  if (nextActivePath) {
    router.push(nextActivePath)
  }
}

const actionMenuItems = computed(
  () =>
    [
      {
        key: 'refresh',
        label: '刷新当前页',
        icon: ReloadOutlined,
      },
      {
        key: 'close-current',
        label: '关闭当前页',
        icon: CloseOutlined,
        disabled: !activeTab.value || activeTab.value.affix,
      },
      {
        type: 'divider',
      },
      {
        key: 'close-others',
        label: '关闭其他标签',
      },
      {
        key: 'close-all',
        label: '关闭全部标签',
      },
    ] as MenuProps['items'],
)

const handleClickActionMenu: MenuEmits['click'] = info => {
  if (info.key === 'refresh') {
    tabsStore.refreshTab(route.path)
    return
  }
  if (info.key === 'close-current') {
    closeTab(route.path)
    return
  }
  if (info.key === 'close-others') {
    tabsStore.closeOtherTabs(route.path)
    return
  }
  if (info.key === 'close-all') {
    const nextActivePath = tabsStore.closeAllTabs(route.path)
    if (nextActivePath) {
      router.push(nextActivePath)
    }
  }
}
</script>

<template>
  <div class="bg-container border-b border-border-sec px-4">
    <a-tabs
      :active-key="route.path"
      :items="tabItems"
      hide-add
      size="small"
      type="editable-card"
      :classes="{ root: 'admin-tab-bar' }"
      @change="handleChange"
      @edit="handleEdit"
    >
      <template #rightExtra>
        <a-dropdown :trigger="['click']">
          <template #popupRender>
            <a-menu :items="actionMenuItems" @click="handleClickActionMenu"></a-menu>
          </template>
          <button
            type="button"
            class="flex h-7 w-7 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-base hover:text-text"
            title="标签操作"
          >
            <DownOutlined class="text-xs" />
          </button>
        </a-dropdown>
      </template>
    </a-tabs>
  </div>
</template>

<style>
.admin-tab-bar .ant-tabs-nav {
  margin-bottom: 0;
}
</style>
