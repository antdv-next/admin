<script setup lang="ts">
defineOptions({ name: 'AdminIframePage' })

definePage({
  meta: {
    access: {
      mode: 'login',
    },
    title: '外部页面',
  },
})

const route = useRoute()

// 仅允许 http/https 外部地址，拦截 javascript: 等危险协议
const iframeSrc = computed(() => {
  const src = route.query.src
  if (typeof src !== 'string') {
    return undefined
  }

  try {
    const url = new URL(src)
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : undefined
  } catch {
    return undefined
  }
})

const iframeTitle = computed(() =>
  typeof route.query.title === 'string' ? route.query.title : '外部页面',
)
</script>

<template>
  <div class="h-[calc(100vh-56px-40px)]">
    <iframe
      v-if="iframeSrc"
      :src="iframeSrc"
      :title="iframeTitle"
      class="h-full w-full border-0 bg-container"
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads"
      referrerpolicy="no-referrer"
    />
    <div v-else class="flex h-full items-center justify-center">
      <a-empty description="外部页面地址无效或未配置" />
    </div>
  </div>
</template>
