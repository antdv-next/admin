<script setup lang="ts">
import { useDarkMode } from '@/composables/dark'

const { toggleDark } = useDarkMode()
</script>

<template>
  <div>
    <a-button @click="() => toggleDark()">
      切换暗黑模式
    </a-button>
  </div>
</template>
