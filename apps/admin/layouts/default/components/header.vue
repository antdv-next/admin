<script setup lang="ts">
import Logo from '../../components/logo.vue'

defineOptions({
  name: 'DefaultHeader',
})
</script>

<template>
  <div class="flex items-center justify-between">
    <div>
      <Logo />
    </div>
    <div>
      内容区域
    </div>
  </div>
</template>
