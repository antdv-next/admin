<script setup lang="ts">
import type { ConfigProviderProps } from 'antdv-next';

import { useGlobalToken } from '@/composables/token';

import { defaultConfig } from '../components/config.ts';
import DefaultHeader from './components/header.vue';

type ThemeType = NonNullable<ConfigProviderProps['theme']>;
type ComponentsType = NonNullable<ThemeType['components']>;
type LayoutType = NonNullable<ComponentsType['Layout']>;
const { token } = useGlobalToken();
const themeConfig = computed(() => {
  const layoutConfig: LayoutType = {
    colorBgLayout: 'transparent',
    headerHeight: 56,
    siderBg: token.value?.colorBgContainer,
    headerPadding: '0 20px',
  };

  return {
    components: {
      Layout: layoutConfig,
    },
  } as ThemeType;
});
</script>

<template>
  <a-config-provider :theme="themeConfig">
    <a-layout class="min-h-screen">
      <a-layout-header>
        <DefaultHeader />
      </a-layout-header>
      <a-layout>
        <a-layout-sider
          :width="defaultConfig.siderWidth"
          :collapsed-width="defaultConfig.collapsedWidth"
        >
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
