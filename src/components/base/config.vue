<script setup lang="ts">
import { theme } from 'antdv-next'
import { useGlobalToken } from '@/composables/token'

defineOptions({
  name: 'BaseConfig',
})
const { token } = theme.useToken()
const globalToken = useGlobalToken()
watchEffect(() => {
  globalToken.token.value = token.value
})
</script>

<template>
  <a-style-provider layer>
    <a-config-provider :theme="{ zeroRuntime: true }">
      <a-app>
        <slot />
      </a-app>
    </a-config-provider>
  </a-style-provider>
</template>
