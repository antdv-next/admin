<script setup lang="ts">
import { ConfigProvider } from 'antdv-next';

import { useTheme } from '@/components/base/theme';

import BaseApp from './app.vue';
import BaseToken from './token.vue';

defineOptions({
  name: 'BaseConfig',
});
const { theme } = useTheme();
const instance = getCurrentInstance();
watchEffect(() => {
  // 兼容使用静态方法的情况
  ConfigProvider.config({
    theme: theme.value,
    appContext: instance?.appContext,
  });
});
</script>

<template>
  <a-style-provider layer>
    <a-config-provider :theme="theme">
      <BaseToken>
        <a-app class="min-h-screen">
          <BaseApp>
            <slot />
          </BaseApp>
        </a-app>
      </BaseToken>
    </a-config-provider>
  </a-style-provider>
</template>
