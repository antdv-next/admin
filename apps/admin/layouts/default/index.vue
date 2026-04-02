<script setup lang="ts">
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@antdv-next/icons'
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

const {
  collapsedWidth,
  siderWidth,
  headerHeight,
  headerDarkShadow,
  headerLightShadow,
  headerZIndex,
  siderFooterHeight,
} = defaultConfig

const siderBodyStyle = computed(() => ({
  height: `calc(100vh - ${headerHeight}px - ${siderFooterHeight}px)`,
}))
const headerStyle = computed(() => ({
  zIndex: headerZIndex,
  boxShadow: isDark.value ? headerDarkShadow : headerLightShadow,
  height: `${headerHeight}px`,
}))
const contentStyle = computed(() => ({
  marginLeft: `${collapsed.value ? collapsedWidth : siderWidth}px`,
  transition: 'margin-left 0.2s ease',
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
      <a-layout-header class="fixed inset-x-0 top-0" :style="headerStyle">
        <DefaultHeader :collapsed="collapsed" @toggle-collapse="appStore.toggleCollapsed" />
      </a-layout-header>

      <a-layout class="min-h-screen">
        <a-layout-sider
          class="fixed inset-y-0 left-0 overflow-hidden antdv-admin-sider z-10"
          :collapsed="collapsed"
          :width="siderWidth"
          :collapsed-width="collapsedWidth"
        >
          <div class="shrink-0" :style="{ height: `${headerHeight}px` }" />
          <div class="overflow-hidden" :style="siderBodyStyle">
            <DefaultSider :collapsed="collapsed" />
          </div>
          <div class="h-9">
            <a-menu
              :items="[{ key: 'collapse' }]"
              :selected-keys="[]"
              @click="appStore.toggleCollapsed()"
              mode="inline"
              class="border-r-0 border-t border-t-border-sec"
            >
              <template #iconRender>
                <MenuUnfoldOutlined v-if="collapsed" />
                <MenuFoldOutlined v-else />
              </template>
            </a-menu>
          </div>
        </a-layout-sider>

        <a-layout class="min-h-screen pt-14" :style="contentStyle">
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

<style>
.antdv-admin-sider {
  box-shadow: 2px 0 8px #1d23290d;
}
.dark .antdv-admin-sider {
  box-shadow: 0 2px 8px #0d0d0da6;
}
</style>
