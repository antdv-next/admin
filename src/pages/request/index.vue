<script setup lang="ts">
import { testGetApi, testPostApi, testPutApi } from '@/api/test'

async function commonTestApi(apiFunc: () => Promise<any>) {
  try {
    const response = await apiFunc()
    // eslint-disable-next-line no-console
    console.log('API Response:', response)
  } catch (error) {
    console.error('API Error:', error)
  }
}

const handleTestGetApi = () => commonTestApi(testGetApi)
const handleTestPostApi = () => commonTestApi(testPostApi)
const handleTestPutApi = () => commonTestApi(testPutApi)
</script>

<template>
  <div>
    <a-space>
      <a-button @click="handleTestGetApi"> GET </a-button>
      <a-button @click="handleTestPostApi"> POST </a-button>
      <a-button @click="handleTestPutApi"> PUT </a-button>
    </a-space>
    <h1>请求验证</h1>
  </div>
</template>
