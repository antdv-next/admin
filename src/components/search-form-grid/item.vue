<script setup lang="ts">
import type { ColProps } from 'antdv-next'
import { computed, inject } from 'vue'
import { searchFormGridKey } from './shared'

defineOptions({ name: 'SearchFormGridItem' })

const props = defineProps<{
  colProps?: ColProps
}>()

const searchFormGridContext = inject(searchFormGridKey)

if (!searchFormGridContext) {
  throw new Error('SearchFormGridItem must be used inside SearchFormGrid')
}

const itemIndex = searchFormGridContext.registerItem()

const mergedColProps = computed<ColProps>(() => ({
  ...searchFormGridContext.itemColProps.value,
  ...props.colProps,
}))

const isVisible = computed(() => {
  if (!searchFormGridContext.isCollapsed.value) {
    return true
  }

  return itemIndex < searchFormGridContext.visibleCount.value
})
</script>

<template>
  <a-col v-if="isVisible" v-bind="mergedColProps" class="search-form-grid__item">
    <slot />
  </a-col>
</template>
