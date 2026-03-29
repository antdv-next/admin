<script setup lang="ts">
import type { ConfigProviderProps } from 'antdv-next'
import { storeToRefs } from 'pinia'
import { useGlobalToken } from '@/composables/token'
import { useAppStore } from '@/stores/app'
import { defaultConfig } from '../components/config'
import DefaultHeader from './components/header.vue'
import DefaultSider from './components/sider.vue'

type ThemeType = NonNullable<ConfigProviderProps['theme']>
type ComponentsType = NonNullable<ThemeType['components']>
type LayoutType = NonNullable<ComponentsType['Layout']>
const appStore = useAppStore()
const { collapsed } = storeToRefs(appStore)
const { token } = useGlobalToken()
const themeConfig = computed(() => {
  const layoutConfig: LayoutType = {
    colorBgLayout: 'transparent',
    headerHeight: 56,
    siderBg: token.value?.colorBgContainer,
    headerPadding: '0 20px',
  }

  return {
    components: {
      Layout: layoutConfig,
    },
  } as ThemeType
})
</script>

<template>
  <a-config-provider :theme="themeConfig">
    <a-layout class="min-h-screen">
      <a-layout-header>
        <DefaultHeader :collapsed="collapsed" @toggle-collapse="appStore.toggleCollapsed" />
      </a-layout-header>
      <a-layout>
        <a-layout-sider
          :collapsed="collapsed"
          :width="defaultConfig.siderWidth"
          :collapsed-width="defaultConfig.collapsedWidth"
        >
          <DefaultSider :collapsed="collapsed" />
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
