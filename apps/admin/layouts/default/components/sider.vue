<script setup lang="ts">
import type { MenuEmits } from 'antdv-next'
import { useUserStore } from '@/stores/user'
import { createSiderMenuState, resolveSiderOpenKeys } from './sider-menu'

defineOptions({
  name: 'DefaultLayoutSider',
})

const props = defineProps<{
  collapsed: boolean
}>()

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const openKeys = shallowRef<string[]>([])
const cachedOpenKeys = shallowRef<string[]>([])

const menuState = computed(() => createSiderMenuState(userStore.menus, route.path))
const menuItems = computed(() => menuState.value.items)
const navigableKeys = computed(() => new Set(menuState.value.navigableKeys))
const selectedKeys = computed(() => menuState.value.selectedKeys)

watch(
  [() => props.collapsed, () => menuState.value.openKeys],
  ([collapsed, routeOpenKeys], previousValue) => {
    const previousCollapsed = previousValue?.[0] ?? false
    const nextState = resolveSiderOpenKeys({
      collapsed,
      previousCollapsed,
      currentOpenKeys: openKeys.value,
      cachedOpenKeys: cachedOpenKeys.value,
      routeOpenKeys,
    })

    openKeys.value = nextState.openKeys
    cachedOpenKeys.value = nextState.cachedOpenKeys
  },
  {
    immediate: true,
  },
)

const handleClickMenu: MenuEmits['click'] = ({ key }) => {
  const targetPath = typeof key === 'string' ? key : String(key)
  if (!navigableKeys.value.has(targetPath)) {
    return
  }

  if (targetPath.startsWith('/')) {
    router.push(targetPath)
  }
}

function handleOpenChange(nextOpenKeys: string[]) {
  openKeys.value = nextOpenKeys
}
</script>

<template>
  <div class="h-full overflow-y-auto">
    <a-menu
      mode="inline"
      :inline-collapsed="collapsed"
      :items="menuItems"
      :open-keys="openKeys"
      :selected-keys="selectedKeys"
      @click="handleClickMenu"
      @openChange="handleOpenChange"
      class="w-full"
      :classes="{
        root: 'antdv-admin-sider-root',
      }"
    />
  </div>
</template>

<style>
.antdv-admin-sider-root {
  border-inline-end: unset;
}
.antdv-admin-sider-subMenu {
  background: unset;
}
</style>
