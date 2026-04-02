<script setup lang="ts">
import { DownOutlined } from '@antdv-next/icons'
import { useBreakpoint } from 'antdv-next'
import type { ColProps, RowProps } from 'antdv-next'
import type { VNode } from 'vue'
import { Comment, Fragment, computed, provide, shallowRef, useSlots } from 'vue'
import {
  createActionColProps,
  getCollapsedItemCountAtBreakpoint,
  getDefaultCollapsedItemCount,
  resolveActiveBreakpoint,
  shouldShowCollapseToggle,
} from './layout'
import { searchFormGridKey } from './shared'
defineOptions({ name: 'SearchFormGrid' })

const props = withDefaults(
  defineProps<{
    itemColProps: ColProps
    gutter?: RowProps['gutter']
    defaultExpanded?: boolean
    collapsedItemCount?: number
  }>(),
  {
    gutter: () => [12, 12] as [number, number],
    defaultExpanded: false,
  },
)

const slots = useSlots()
const screens = useBreakpoint()
const expanded = shallowRef(props.defaultExpanded)

function flattenChildren(children: VNode[]): VNode[] {
  return children.flatMap(child => {
    if (child.type === Comment) {
      return []
    }

    if (child.type === Fragment) {
      return flattenChildren((child.children as VNode[]) ?? [])
    }

    if (typeof child.children === 'string' && child.children.trim().length === 0) {
      return []
    }

    return [child]
  })
}

const totalItems = computed(() => flattenChildren(slots.default?.() ?? []).length)
const currentBreakpoint = computed(() => resolveActiveBreakpoint(screens.value))

const resolvedCollapsedItemCount = computed(() =>
  Math.max(
    1,
    props.collapsedItemCount ??
      (currentBreakpoint.value
        ? getCollapsedItemCountAtBreakpoint(props.itemColProps, currentBreakpoint.value)
        : getDefaultCollapsedItemCount(props.itemColProps)),
  ),
)

const showToggle = computed(() =>
  shouldShowCollapseToggle(totalItems.value, props.itemColProps, resolvedCollapsedItemCount.value),
)

const isCollapsed = computed(() => showToggle.value && !expanded.value)
const visibleCount = computed(() =>
  isCollapsed.value
    ? Math.min(totalItems.value, resolvedCollapsedItemCount.value)
    : totalItems.value,
)

const actionColProps = computed(() => createActionColProps(props.itemColProps, visibleCount.value))
const hasActions = computed(() => Boolean(slots.actions) || showToggle.value)

let itemIndex = 0

provide(searchFormGridKey, {
  itemColProps: computed(() => props.itemColProps),
  isCollapsed,
  visibleCount,
  registerItem() {
    const currentIndex = itemIndex
    itemIndex += 1
    return currentIndex
  },
})
</script>

<template>
  <a-row class="search-form-grid w-full" :gutter="gutter">
    <slot />

    <a-col v-if="hasActions" v-bind="actionColProps">
      <div class="flex items-center justify-end gap-4 mr-4">
        <slot name="actions" />
        <a-button
          v-if="showToggle"
          type="link"
          class="px-0! shrink-0"
          @click="expanded = !expanded"
        >
          <template #icon>
            <DownOutlined
              style="transition: all 0.3s"
              :style="{
                transform: !expanded ? undefined : 'rotate(180deg)',
              }"
            />
          </template>
          {{ expanded ? '收起' : '展开' }}
        </a-button>
      </div>
    </a-col>
  </a-row>
</template>
