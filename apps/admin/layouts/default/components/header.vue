<script setup lang="ts">
import {
  GlobalOutlined,
  LogoutOutlined,
  MoonOutlined,
  SunOutlined,
  UserOutlined,
} from '@antdv-next/icons'
import type { MenuEmits, MenuProps } from 'antdv-next'
import { useLocale } from '@/composables/locale'
import { SUPPORT_LOCALES } from '@/constants/locale'
import type { SupportLocale } from '@/constants/locale'
import { useUserStore } from '@/stores/user'
import Logo from '../../components/logo.vue'

defineOptions({
  name: 'DefaultHeader',
})

const router = useRouter()
const userStore = useUserStore()
const { isDark, toggleDark } = useDarkMode()
const { locale, changeLocale } = useLocale()

const localeMenuItems = computed(
  () =>
    SUPPORT_LOCALES.map(item => ({
      key: item.value,
      label: item.label,
    })) as MenuProps['items'],
)

const handleClickLocaleMenu: MenuEmits['click'] = info => {
  void changeLocale(info.key as SupportLocale)
}

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
  } else if (key === 'profile') {
    router.push('/admin/user')
  }
}
</script>

<template>
  <div :class="isDark ? '' : 'text-white/80'" class="flex h-full items-center justify-between">
    <div class="flex items-center gap-3">
      <Logo />
    </div>
    <div class="flex items-center gap-3">
      <button
        type="button"
        class="flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-white/10"
        :title="isDark ? '切换为浅色模式' : '切换为深色模式'"
        @click="toggleDark()"
      >
        <MoonOutlined v-if="!isDark" class="text-base" />
        <SunOutlined v-else class="text-base" />
      </button>

      <a-dropdown :trigger="['click']">
        <template #popupRender>
          <a-menu
            :items="localeMenuItems"
            :selected-keys="[locale]"
            @click="handleClickLocaleMenu"
          ></a-menu>
        </template>
        <button
          type="button"
          class="flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-white/10"
          title="切换语言"
        >
          <GlobalOutlined class="text-base" />
        </button>
      </a-dropdown>

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
