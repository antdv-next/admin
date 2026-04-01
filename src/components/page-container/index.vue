<script setup lang="ts">
defineOptions({
  name: 'PageContainer',
})
</script>

<template>
  <div class="page-container">
    <slot name="header">
      <div class="bg-container h-25">测试</div>
    </slot>
    <slot />
  </div>
</template>
