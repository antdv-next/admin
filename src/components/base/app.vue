<script setup lang="ts">
import { App } from 'antdv-next'
import { useGlobalApp } from '@/composables/app'

defineOptions({
  name: 'BaseApp',
})

const { notification, message, modal } = App.useApp()

const { registerApp } = useGlobalApp()
registerApp({
  notification,
  message,
  modal,
})
</script>

<template>
  <slot />
</template>
