<script setup lang="ts">
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@antdv-next/icons'
import type { MenuEmits, MenuProps } from 'antdv-next'
import { useUserStore } from '@/stores/user'
import Logo from '../../components/logo.vue'

defineOptions({
  name: 'DefaultHeader',
})

defineProps<{
  collapsed: boolean
}>()

const emit = defineEmits<{
  toggleCollapse: []
}>()

const router = useRouter()
const userStore = useUserStore()
const { isDark } = useDarkMode()

const isLoggedIn = computed(() => !!userStore.token)
const showUserLoading = computed(
  () => isLoggedIn.value && (userStore.userInfoLoading || !userStore.userInfo),
)
const displayName = computed(
  () => userStore.userInfo?.nickname || userStore.userInfo?.username || '用户',
)
const avatar = computed<string | undefined>(() => undefined)

function handleLogout() {
  userStore.logout()
  router.push('/login')
}

const menuItems = computed(
  () =>
    [
      {
        key: 'profile',
        label: '个人中心',
        icon: UserOutlined,
      },
      {
        type: 'divider',
      },
      {
        key: 'logout',
        label: '退出登录',
        icon: LogoutOutlined,
      },
    ] as MenuProps['items'],
)

const handleClickMenu: MenuEmits['click'] = info => {
  const key = info.key
  if (key === 'logout') {
    handleLogout()
  }
}
</script>

<template>
  <div :class="isDark ? '' : 'text-white/80'" class="flex h-full items-center justify-between">
    <div class="flex items-center gap-3">
      <Logo />
      <a-button type="text" size="small" @click="emit('toggleCollapse')">
        <template #icon>
          <MenuUnfoldOutlined v-if="collapsed" />
          <MenuFoldOutlined v-else />
        </template>
      </a-button>
    </div>
    <div class="flex items-center gap-3">
      <div class="flex items-center justify-center h-full" v-if="showUserLoading">
        <div class="gap-2 px-2 py-1 h-8 flex">
          <a-skeleton-avatar active size="small" />
          <a-skeleton-button size="small" active style="width: 60px" />
        </div>
      </div>

      <a-dropdown v-else :trigger="['click']">
        <template #popupRender>
          <a-menu :items="menuItems" @click="handleClickMenu"></a-menu>
        </template>
        <div
          class="flex items-center gap-2 cursor-pointer rounded-md px-2 py-1 text-sm transition-colors"
        >
          <a-avatar :size="32" :src="avatar">
            <template #icon>
              <UserOutlined />
            </template>
          </a-avatar>
          <span class="font-medium">{{ displayName }}</span>
        </div>
      </a-dropdown>
    </div>
  </div>
</template>
