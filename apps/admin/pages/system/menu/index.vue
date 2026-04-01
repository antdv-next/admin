<script setup lang="ts">
import PageContainer from '@/components/page-container/index.vue'

defineOptions({ name: 'AdminSystemMenuPage' })

definePage({
  meta: {
    title: '菜单管理',
  },
})
</script>

<template>
  <page-container>
    <div class="h-screen">Form</div>

    <div>Table</div>
  </page-container>
</template>
