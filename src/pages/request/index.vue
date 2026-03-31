<script setup lang="ts">
import { testGetMethod, testPostMethod, testPutMethod } from '@/api/test'
import { useAlovaRequest } from '@/utils/request'

const lastResponse = shallowRef('点击按钮发起请求')

function bindDebugLabel(label: string) {
  return (response: unknown) => {
    const payload = `${label}: ${JSON.stringify(response, null, 2)}`
    lastResponse.value = payload
    console.log(payload)
  }
}

const getRequest = useAlovaRequest(testGetMethod, {
  immediate: false,
}).onSuccess(bindDebugLabel('GET'))

const postRequest = useAlovaRequest(testPostMethod, {
  immediate: false,
}).onSuccess(bindDebugLabel('POST'))

const putRequest = useAlovaRequest(testPutMethod, {
  immediate: false,
}).onSuccess(bindDebugLabel('PUT'))
</script>

<template>
  <div>
    <a-space>
      <a-button :loading="getRequest.loading.value" @click="getRequest.send()"> GET </a-button>
      <a-button :loading="postRequest.loading.value" @click="postRequest.send()"> POST </a-button>
      <a-button :loading="putRequest.loading.value" @click="putRequest.send()"> PUT </a-button>
    </a-space>
    <h1>请求验证</h1>
    <pre class="mt-4 rounded-lg bg-base p-4 text-xs text-text-secondary">{{ lastResponse }}</pre>
  </div>
</template>
