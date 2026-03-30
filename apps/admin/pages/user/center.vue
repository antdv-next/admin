<script setup lang="ts">
defineOptions({ name: 'AdminUserCenterPage' })

definePage({
  meta: {
    access: {
      mode: 'inherit',
      from: '/admin/user',
    },
  },
})

const metrics = [
  { label: '今日访问', value: '1,284' },
  { label: '待处理消息', value: '12' },
  { label: '已连接应用', value: '4' },
] as const
</script>

<template>
  <section class="space-y-4">
    <div class="rounded-2xl border border-border bg-container p-6 shadow-sm">
      <h2 class="text-xl font-semibold text-text">中心页</h2>
      <p class="mt-2 text-sm leading-6 text-text-secondary">
        这里是 `/admin/user/center` 的示例内容页，它继承父级 `user.vue` 的公共壳和登录权限。
      </p>
    </div>

    <div class="grid gap-4 md:grid-cols-3">
      <article
        v-for="metric in metrics"
        :key="metric.label"
        class="rounded-2xl border border-border bg-container p-5 shadow-sm"
      >
        <div class="text-sm text-text-secondary">{{ metric.label }}</div>
        <div class="mt-2 text-3xl font-semibold text-text">{{ metric.value }}</div>
      </article>
    </div>
  </section>
</template>
