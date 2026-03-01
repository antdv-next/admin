<script setup lang="ts">
defineOptions({
  name: 'BaseConfig',
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
