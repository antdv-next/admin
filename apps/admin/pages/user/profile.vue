<script setup lang="ts">
defineOptions({ name: 'AdminUserProfilePage' })

definePage({
  meta: {
    access: {
      mode: 'inherit',
      from: '/admin/user',
    },
  },
})

const fields = [
  { label: '昵称', value: 'Antdv Next Admin' },
  { label: '邮箱', value: 'admin@example.com' },
  { label: '角色', value: 'Administrator' },
] as const
</script>

<template>
  <section class="rounded-2xl border border-border bg-container p-6 shadow-sm">
    <div
      class="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h2 class="text-xl font-semibold text-text">个人资料</h2>
        <p class="mt-2 text-sm leading-6 text-text-secondary">
          示例资料页，后续可以替换成真实表单或详情展示。
        </p>
      </div>
      <a-tag color="blue">Login Protected</a-tag>
    </div>

    <dl class="mt-6 grid gap-4 md:grid-cols-3">
      <div v-for="field in fields" :key="field.label" class="rounded-xl bg-base px-4 py-4">
        <dt class="text-sm text-text-secondary">{{ field.label }}</dt>
        <dd class="mt-2 text-base font-medium text-text">{{ field.value }}</dd>
      </div>
    </dl>
  </section>
</template>
