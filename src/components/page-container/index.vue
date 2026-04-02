<script setup lang="ts">
import AntdIcon from '@/components/icons/antd.vue'
import { useUserStore } from '@/stores/user'
import { resolveMenuBreadcrumbItems } from '@/utils/menu-breadcrumb'

defineOptions({
  name: 'PageContainer',
})

const route = useRoute()
const userStore = useUserStore()

const breadcrumbItems = computed(() => resolveMenuBreadcrumbItems(userStore.menus, route.path))
const pageTitle = computed(() => {
  const title = route.meta.title

  return typeof title === 'string' ? title : ''
})
</script>

<template>
  <div class="page-container space-y-4">
    <div class="bg-container px-4 py-3">
      <a-breadcrumb v-if="breadcrumbItems.length">
        <a-breadcrumb-item v-for="item in breadcrumbItems" :key="item.key">
          <router-link
            v-if="item.path && item.path !== route.path"
            :to="item.path"
            class="inline-flex items-center gap-1.5"
          >
            <AntdIcon v-if="item.icon" :icon="item.icon" />
            {{ item.title }}
          </router-link>
          <span v-else class="inline-flex items-center gap-1.5">
            <AntdIcon v-if="item.icon" :icon="item.icon" />
            {{ item.title }}
          </span>
        </a-breadcrumb-item>
      </a-breadcrumb>
      <div v-if="pageTitle" class="mt-4 text-lg font-medium text-text">
        {{ pageTitle }}
      </div>
    </div>
    <slot />
  </div>
</template>
