<script setup lang="ts">
import type { ConfigProviderProps } from 'antdv-next'
import { storeToRefs } from 'pinia'
import { useDarkMode } from '@/composables/dark'
import { useGlobalToken } from '@/composables/token'
import { useAppStore } from '@/stores/app'
import { defaultConfig } from '../components/config'
import DefaultHeader from './components/header.vue'
import PageSkeleton from './components/page-skeleton.vue'
import DefaultSider from './components/sider.vue'

type ThemeType = NonNullable<ConfigProviderProps['theme']>
type ComponentsType = NonNullable<ThemeType['components']>
type LayoutType = NonNullable<ComponentsType['Layout']>

const appStore = useAppStore()
const { collapsed } = storeToRefs(appStore)
const { token } = useGlobalToken()
const { isDark } = useDarkMode()

const headerHeight = defaultConfig.headerHeight
const siderWidth = computed(() =>
  collapsed.value ? defaultConfig.collapsedWidth : defaultConfig.siderWidth,
)
const siderStyle = computed(() => ({
  width: `${siderWidth.value}px`,
  zIndex: defaultConfig.siderZIndex,
}))
const siderBodyStyle = computed(() => ({
  height: `calc(100vh - ${headerHeight}px)`,
}))
const headerStyle = computed(() => ({
  zIndex: defaultConfig.headerZIndex,
}))
const contentStyle = computed(() => ({
  marginLeft: `${siderWidth.value}px`,
}))

const themeConfig = computed(() => {
  const layoutConfig: LayoutType = {
    colorBgLayout: 'transparent',
    headerHeight,
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
    <a-layout class="min-h-screen" :class="isDark ? 'bg-[#2a2c2c]' : 'bg-[#f0f2f5]'">
      <a-layout-header
        data-test="admin-fixed-header"
        class="fixed inset-x-0 top-0 h-14"
        :style="headerStyle"
      >
        <DefaultHeader :collapsed="collapsed" @toggle-collapse="appStore.toggleCollapsed" />
      </a-layout-header>

      <a-layout class="min-h-screen">
        <a-layout-sider
          data-test="admin-fixed-sider"
          class="fixed inset-y-0 left-0 overflow-hidden antdv-admin-sider"
          :style="siderStyle"
          :collapsed="collapsed"
          :width="defaultConfig.siderWidth"
          :collapsed-width="defaultConfig.collapsedWidth"
        >
          <div data-test="admin-sider-header-spacer" class="h-14 shrink-0" />
          <div data-test="admin-sider-scroll-body" class="overflow-hidden" :style="siderBodyStyle">
            <DefaultSider :collapsed="collapsed" />
          </div>
        </a-layout-sider>

        <a-layout data-test="admin-layout-content" class="min-h-screen pt-14" :style="contentStyle">
          <a-layout-content class="min-h-[calc(100vh-56px)]">
            <router-view v-slot="{ Component, route }">
              <Suspense>
                <component :is="Component" :key="route.fullPath" />
                <template #fallback>
                  <PageSkeleton />
                </template>
              </Suspense>
            </router-view>
          </a-layout-content>
        </a-layout>
      </a-layout>
    </a-layout>
  </a-config-provider>
</template>
