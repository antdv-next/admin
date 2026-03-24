<script setup lang="ts">
import { App } from 'antdv-next'

import { useApp } from '@/composables/app'

defineOptions({
  name: 'BaseApp',
})

const { notification, message, modal } = App.useApp()

const { registerApp } = useApp()
registerApp({
  notification,
  message,
  modal,
})
</script>

<template>
  <slot />
</template>
