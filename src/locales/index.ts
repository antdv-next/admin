import type { App } from 'vue'
import { createI18n } from 'vue-i18n'
import { useLocale } from '@/composables/locale'

export const setupI18n = async (app: App) => {
  const { setI18n } = useLocale()
  const i18n = createI18n({
    locale: 'zh-CN',
    fallbackLocale: 'zh-CN',
    messages: {},
    legacy: false,
  })
  setI18n(i18n)
  app.use(i18n)
}
