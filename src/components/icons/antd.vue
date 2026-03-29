<script setup lang="ts">
import * as allIcons from '@antdv-next/icons/all'
type AllIcons = keyof typeof allIcons
const { icon } = defineProps<{
  icon: AllIcons | string
}>()

defineOptions({
  name: 'AntdIcon',
})

const IconComponent = computed(() => (allIcons as any)[icon])
</script>

<template>
  <component :is="IconComponent" v-if="IconComponent" />
</template>
