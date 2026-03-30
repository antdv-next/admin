<script setup lang="ts">
defineOptions({ name: 'AdminUserOverviewPage' })

definePage({
  meta: {
    access: {
      mode: 'inherit',
      from: '/admin/user',
    },
  },
})

const cards = [
  {
    title: '公共入口',
    description: '后续用户中心相关页面都可以直接挂到 `/admin/user/**` 下。',
  },
  {
    title: '共享壳层',
    description: '头部说明、二级导航和公共提示统一放在父路由 `user.vue` 中。',
  },
  {
    title: '权限模型',
    description: '当前只要求登录，不依赖后台菜单权限即可访问。',
  },
] as const
</script>

<template>
  <section class="grid gap-4 lg:grid-cols-3">
    <article
      v-for="card in cards"
      :key="card.title"
      class="rounded-2xl border border-border bg-container p-5 shadow-sm"
    >
      <h2 class="text-lg font-medium text-text">{{ card.title }}</h2>
      <p class="mt-2 text-sm leading-6 text-text-secondary">{{ card.description }}</p>
    </article>
  </section>
</template>
