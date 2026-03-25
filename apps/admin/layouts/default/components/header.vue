<script setup lang="ts">
import { LoginOutlined, UserOutlined } from '@antdv-next/icons'

import { useUserStore } from '@/stores/user'

import Logo from '../../components/logo.vue'

defineOptions({
  name: 'DefaultHeader',
})

const router = useRouter()
const userStore = useUserStore()

const isLoggedIn = computed(() => !!userStore.token)
const showUserLoading = computed(
  () => isLoggedIn.value && (userStore.userInfoLoading || !userStore.userInfo),
)
const displayName = computed(
  () => userStore.userInfo?.nickname || userStore.userInfo?.username || '用户',
)
const avatar = computed<string | undefined>(() => undefined)

function handleLogin() {
  router.push('/login')
}

function handleLogout() {
  userStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="flex h-full items-center justify-between">
    <div>
      <Logo />
    </div>
    <div class="flex items-center gap-3">
      <div v-if="showUserLoading" class="flex items-center gap-2 px-2 py-1">
        <a-skeleton-avatar active :size="32" />
        <a-skeleton-button size="small" active :width="100" />
      </div>

      <a-popover v-else-if="isLoggedIn" trigger="click">
        <template #content>
          <a-button danger type="text" @click="handleLogout"> 退出登录 </a-button>
        </template>

        <button
          type="button"
          class="flex items-center gap-2 rounded-md px-2 py-1 text-sm text-text transition-colors hover:bg-black/5"
        >
          <a-avatar :size="32" :src="avatar">
            <template #icon>
              <UserOutlined />
            </template>
          </a-avatar>
          <span class="font-medium">{{ displayName }}</span>
        </button>
      </a-popover>

      <a-button v-else type="primary" size="small" @click="handleLogin">
        <template #icon>
          <LoginOutlined />
        </template>
        登录
      </a-button>
    </div>
  </div>
</template>
