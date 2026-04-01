<script setup lang="ts">
const WORKSPACE_OVERVIEW_PATH = '/admin/workspace/overview'

definePage({
  meta: {
    access: {
      mode: 'public',
    },
  },
})

const router = useRouter()

function goToWorkspaceOverview() {
  router.push(WORKSPACE_OVERVIEW_PATH)
}

function goBack() {
  if (window.history.state?.back) {
    router.back()
    return
  }

  goToWorkspaceOverview()
}
</script>

<template>
  <div class="flex min-h-[60vh] items-center justify-center px-6 py-10">
    <a-result
      status="404"
      title="页面不存在"
      sub-title="你访问的管理后台页面不存在，可能已被移除或路径填写有误。"
    >
      <template #extra>
        <div class="flex flex-wrap items-center justify-center gap-3">
          <a-button @click="goBack"> 返回上一页 </a-button>
          <a-button type="primary" @click="goToWorkspaceOverview"> 回到工作台 </a-button>
        </div>
      </template>
    </a-result>
  </div>
</template>
