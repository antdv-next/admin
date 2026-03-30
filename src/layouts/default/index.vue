<script setup lang="ts">
import { useDarkMode } from '@/composables/dark'
import LayoutFooter from './components/footer.vue'
import LayoutHeader from './components/header.vue'

const { isDark } = useDarkMode()
</script>

<template>
  <div
    class="min-h-screen font-sans"
    :class="isDark ? 'bg-[#2a2c2c] text-gray-100' : 'bg-[#f0f2f5] text-gray-900'"
  >
    <LayoutHeader />
    <main class="pt-16">
      <router-view />
    </main>
    <LayoutFooter />
  </div>
</template>
