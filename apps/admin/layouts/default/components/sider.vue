<script setup lang="ts">
import type { MenuEmits } from 'antdv-next'
import AntdIcon from '@/components/icons/antd.vue'
import { useUserStore } from '@/stores/user'
import { ADMIN_IFRAME_PATH } from '@apps/admin/constants/router'
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
  const navigation = menuState.value.navigationByKey[key]
  if (!navigation) {
    return
  }

  if (navigation.target === '_blank' && navigation.url) {
    window.open(navigation.url, '_blank', 'noopener')
    return
  }

  if (navigation.target === 'iframe' && navigation.url) {
    router.push({
      path: ADMIN_IFRAME_PATH,
      query: {
        src: navigation.url,
        title: navigation.title,
      },
    })
    return
  }

  if (navigation.path?.startsWith('/')) {
    router.push(navigation.path)
  }
}
</script>

<template>
  <div class="h-full overflow-y-auto">
    <a-menu
      mode="inline"
      :items="menuItems"
      v-model:open-keys="openKeys"
      :selected-keys="selectedKeys"
      @click="handleClickMenu"
      class="w-full"
      :classes="{
        root: 'antdv-admin-sider-root',
      }"
    >
      <template #iconRender="menu">
        <template v-if="menu.icon">
          <AntdIcon :icon="menu.icon" />
        </template>
      </template>
    </a-menu>
  </div>
</template>

<style>
.antdv-admin-sider-root {
  border-inline-end: unset;
}
</style>
