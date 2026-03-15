<script setup lang="ts">
</script>

<template>
  <a-config-provider
    :theme="{
      components: {
        Layout: {
          colorBgLayout: 'transparent',
          headerHeight: 56,
          headerBg: '#001529',
        },
      },
    }"
  >
    <a-layout class="min-h-screen">
      <a-layout-header>
        header
      </a-layout-header>
      <a-layout>
        <a-layout-sider>
          sider
        </a-layout-sider>
        <a-layout>
          <a-layout-content>
            <router-view />
          </a-layout-content>
        </a-layout>
      </a-layout>
    </a-layout>
  </a-config-provider>
</template>
