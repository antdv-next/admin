<script setup lang="ts">
defineOptions({
  name: 'Access',
})

const props = withDefaults(
  defineProps<{
    auth: PerCodeType | readonly PerCodeType[]
    mode?: 'all' | 'any'
  }>(),
  {
    mode: 'all',
  },
)

const { hasAccess } = useAccess()
const visible = computed(() => hasAccess(props.auth, props.mode))
</script>

<template>
  <slot v-if="visible" />
</template>
