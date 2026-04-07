<script setup lang="ts">
import { ConfigProvider } from 'antdv-next'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'
import { useTheme } from '@/components/base/theme'
import BaseApp from './app.vue'
import BaseToken from './token.vue'
const { getLocaleMessage, locale } = useI18n()

defineOptions({
  name: 'BaseConfig',
})
const { theme } = useTheme()
const instance = getCurrentInstance()
watchEffect(() => {
  // 兼容使用静态方法的情况
  ConfigProvider.config({
    theme: theme.value,
    appContext: instance?.appContext,
  })
})
const antdLocale = computed(() => getLocaleMessage(locale.value)?.antd)
watchEffect(() => {
  const dayjsName = antdLocale.value?.locale ?? 'zh-cn'
  dayjs.locale(dayjsName)
})
</script>

<template>
  <a-style-provider layer>
    <a-config-provider :theme="theme" :locale="antdLocale">
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
