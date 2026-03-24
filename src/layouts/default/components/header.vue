<script setup lang="ts">
import {
  GithubOutlined,
  LoginOutlined,
  MoonOutlined,
  SunOutlined,
  UserOutlined,
} from '@antdv-next/icons'

import { useDarkMode } from '@/composables/dark'
import { useUserStore } from '@/stores/user'

defineOptions({ name: 'LayoutHeader' })

const { isDark, toggleDark } = useDarkMode()
const userStore = useUserStore()
const router = useRouter()

const isLoggedIn = computed(() => !!userStore.token)

const navLinks = [{ label: '文档', href: 'https://www.antdv-next.com' }]
const isExternalLink = (href: string) => /^https?:\/\//.test(href)
</script>

<template>
  <nav
    class="fixed w-full z-50 border-b backdrop-blur-md h-16"
    :class="isDark ? 'border-white/10 bg-black/50' : 'border-gray-200 bg-white/70'"
  >
    <div class="mx-auto max-w-7xl px-6 h-full flex items-center justify-between">
      <!-- Logo -->
      <router-link to="/" class="flex items-center gap-2">
        <img src="/antdv-next.svg" alt="Antdv Next" class="h-8 w-8" />
        <span class="text-xl font-bold tracking-tight">
          Antdv <span class="text-primary">Next</span>
        </span>
      </router-link>

      <!-- Right area -->
      <div class="hidden md:flex items-center gap-4 text-sm font-medium">
        <a
          v-for="link in navLinks"
          :key="link.label"
          :href="link.href"
          :target="isExternalLink(link.href) ? '_blank' : undefined"
          :rel="isExternalLink(link.href) ? 'noopener noreferrer' : undefined"
          class="transition text-text-secondary hover:text-primary-hover active:text-primary-active"
        >
          {{ link.label }}
        </a>

        <!-- Dark mode toggle -->
        <a-button
          type="text"
          size="small"
          :title="isDark ? '切换亮色模式' : '切换暗黑模式'"
          @click="toggleDark()"
        >
          <template #icon>
            <SunOutlined v-if="isDark" />
            <MoonOutlined v-else />
          </template>
        </a-button>

        <!-- GitHub link -->
        <a-button size="small" href="https://github.com/antdv-next/antdv-next" target="_blank">
          <template #icon>
            <GithubOutlined />
          </template>
          GitHub
        </a-button>

        <!-- User Info / Login -->
        <template v-if="isLoggedIn && userStore.userInfo">
          <a-dropdown
            :menu="{
              items: [
                { key: 'profile', label: '个人中心' },
                { type: 'divider' },
                { key: 'logout', label: '退出登录', danger: true },
              ],
            }"
          >
            <div class="flex cursor-pointer items-center gap-2">
              <a-avatar :size="32" :src="userStore.userInfo.avatar">
                <template #icon>
                  <UserOutlined />
                </template>
              </a-avatar>
              <span class="text-sm font-medium">{{
                userStore.userInfo.nickname || userStore.userInfo.username
              }}</span>
            </div>
          </a-dropdown>
        </template>
        <a-button v-else type="primary" size="small" @click="router.push('/login')">
          <template #icon>
            <LoginOutlined />
          </template>
          登录
        </a-button>
      </div>
    </div>
  </nav>
</template>
