<script setup lang="ts">
import { useTheme } from '@/components/base/theme.ts'
import BaseToken from './token.vue'

defineOptions({
  name: 'BaseConfig',
})
const { theme } = useTheme()
</script>

<template>
  <a-style-provider layer>
    <a-config-provider :theme="theme">
      <BaseToken>
        <a-app>
          <slot />
        </a-app>
      </BaseToken>
    </a-config-provider>
  </a-style-provider>
</template>
