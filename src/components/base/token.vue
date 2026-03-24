<script setup lang="ts">
import { theme } from 'antdv-next'

import { useGlobalToken } from '@/composables/token'

defineOptions({
  name: 'BaseToken',
})
const { token } = theme.useToken()
const globalToken = useGlobalToken()
watchEffect(() => {
  globalToken.token.value = token.value
})
</script>

<template>
  <slot />
</template>
