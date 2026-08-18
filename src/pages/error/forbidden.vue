<script setup lang="ts">
import { getDefaultEntryPath } from '@/router/redirect'

defineOptions({ name: 'GlobalForbiddenPage' })

const router = useRouter()
const authorization = useAuthorization()

function goHome() {
  router.replace(getDefaultEntryPath(Boolean(authorization.value)))
}

function goBack() {
  if (window.history.state?.back) {
    router.back()
    return
  }

  goHome()
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-layout px-6 py-10">
    <a-result
      status="403"
      title="暂无访问权限"
      sub-title="你没有访问该页面的权限，如需开通请联系管理员。"
    >
      <template #extra>
        <div class="flex flex-wrap items-center justify-center gap-3">
          <a-button @click="goBack"> 返回上一页 </a-button>
          <a-button type="primary" @click="goHome"> 回到首页 </a-button>
        </div>
      </template>
    </a-result>
  </div>
</template>
