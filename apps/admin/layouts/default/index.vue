<script setup lang="ts">
import type { ConfigProviderProps } from 'antdv-next'
import { useGlobalToken } from '@/composables/token'

type ThemeType = NonNullable<ConfigProviderProps['theme']>
type ComponentsType = NonNullable<ThemeType['components']>
type LayoutType = NonNullable<ComponentsType['Layout']>
const { token } = useGlobalToken()
const themeConfig = computed(() => {
  const layoutConfig: LayoutType = {
    colorBgLayout: 'transparent',
    headerHeight: 56,
    siderBg: token.value?.colorBgContainer,
  }

  return {
    components: {
      Layout: layoutConfig,
    },
  } as ThemeType
})
</script>

<template>
  <a-config-provider
    :theme="themeConfig"
  >
    <a-layout class="min-h-screen">
      <a-layout-header>
        header
      </a-layout-header>
      <a-layout>
        <a-layout-sider :width="245" :collapsed-width="56">
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
