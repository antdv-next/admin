<script setup lang="ts">
import { useDarkMode } from '@/composables/dark'

defineOptions({ name: 'LayoutHeader' })

const { isDark, toggleDark } = useDarkMode()

const navLinks = [
  { label: '文档', href: 'https://www.antdv-next.com' },
]
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
        <img src="/antdv-next.svg" alt="Antdv Next" class="h-8 w-8">
        <span class="text-xl font-bold tracking-tight">
          Antdv <span class="text-blue-500">Next</span>
        </span>
      </router-link>

      <!-- Right area -->
      <div class="hidden md:flex items-center gap-8 text-sm font-medium">
        <a
          v-for="link in navLinks"
          :key="link.label"
          :href="link.href"
          :target="isExternalLink(link.href) ? '_blank' : undefined"
          :rel="isExternalLink(link.href) ? 'noopener noreferrer' : undefined"
          class="transition"
          :class="isDark ? 'text-gray-400 hover:text-blue-400' : 'text-gray-500 hover:text-blue-500'"
        >
          {{ link.label }}
        </a>

        <!-- Dark mode toggle -->
        <button
          class="flex items-center justify-center h-8 w-8 rounded-lg transition"
          :class="isDark ? 'text-yellow-400 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'"
          :title="isDark ? '切换亮色模式' : '切换暗黑模式'"
          @click="toggleDark()"
        >
          <!-- Sun icon (shown in dark mode) -->
          <svg v-if="isDark" class="h-5 w-5 cursor-pointer" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <!-- Moon icon (shown in light mode) -->
          <svg v-else class="h-5 w-5 cursor-pointer" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>

        <!-- GitHub link -->
        <a
          href="https://github.com/antdv-next/antdv-next"
          target="_blank"
          class="rounded-full px-4 py-2 text-white transition hover:shadow-lg hover:shadow-blue-500/20"
          style="background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%)"
        >
          GitHub
        </a>
      </div>
    </div>
  </nav>
</template>
