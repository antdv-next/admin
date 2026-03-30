<script setup lang="ts">
const route = useRoute()

defineOptions({ name: 'AdminUserShellPage' })

definePage({
  meta: {
    access: {
      mode: 'login',
    },
  },
})

const navItems = [
  {
    key: '/admin/user',
    label: '概览',
    description: '用户中心首页与公共说明',
  },
  {
    key: '/admin/user/center',
    label: '中心页',
    description: '承载用户中心的共享业务入口',
  },
  {
    key: '/admin/user/profile',
    label: '个人资料',
    description: '管理用户资料与基础信息',
  },
] as const

const activeKey = computed(() => {
  const currentPath = route.path.replace(/\/+$/, '') || '/admin/user'
  const matchedItem = [...navItems].reverse().find(item => currentPath.startsWith(item.key))

  return matchedItem?.key ?? '/admin/user'
})
</script>

<template>
  <div class="space-y-6 p-6">
    <section class="rounded-2xl border border-border bg-container p-6 shadow-sm">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div class="space-y-2">
          <p class="text-sm font-medium text-primary">User Center</p>
          <h1 class="text-2xl font-semibold text-text">用户中心</h1>
          <p class="max-w-3xl text-sm leading-6 text-text-secondary">
            这一层作为 `/admin/user/**` 的公共壳，统一承载说明信息、二级导航和子页面出口。
          </p>
        </div>
        <div class="grid gap-3 text-sm text-text-secondary sm:grid-cols-3">
          <div class="rounded-xl bg-base px-4 py-3">
            <div class="text-xs uppercase tracking-wide text-text-tertiary">Route</div>
            <div class="mt-1 font-medium text-text">/admin/user/**</div>
          </div>
          <div class="rounded-xl bg-base px-4 py-3">
            <div class="text-xs uppercase tracking-wide text-text-tertiary">Access</div>
            <div class="mt-1 font-medium text-text">login</div>
          </div>
          <div class="rounded-xl bg-base px-4 py-3">
            <div class="text-xs uppercase tracking-wide text-text-tertiary">Layout</div>
            <div class="mt-1 font-medium text-text">admin/default + user shell</div>
          </div>
        </div>
      </div>
    </section>

    <section class="rounded-2xl border border-border bg-container p-4 shadow-sm">
      <div class="grid gap-3 md:grid-cols-3">
        <RouterLink
          v-for="item in navItems"
          :key="item.key"
          :to="item.key"
          class="rounded-xl border px-4 py-4 transition"
          :class="
            activeKey === item.key
              ? 'border-primary bg-primary/5 text-primary'
              : 'border-border bg-base text-text hover:border-primary/40'
          "
        >
          <div class="font-medium">{{ item.label }}</div>
          <div class="mt-1 text-sm leading-6 text-text-secondary">{{ item.description }}</div>
        </RouterLink>
      </div>
    </section>

    <router-view />
  </div>
</template>
