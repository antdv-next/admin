import type { App } from 'vue'
import { createI18n } from 'vue-i18n'
import messages from 'virtual:i18n-messages'
import { useLocale } from '@/composables/locale'

const DEFAULT_LOCALE = 'zh-CN'

export const setupI18n = async (app: App) => {
  const { setI18n, setI18nLanguage } = useLocale()
  const i18n = createI18n({
    locale: DEFAULT_LOCALE,
    fallbackLocale: DEFAULT_LOCALE,
    messages: {
      [DEFAULT_LOCALE]: messages,
    },
    legacy: false,
  })
  setI18n(i18n)
  setI18nLanguage(DEFAULT_LOCALE)
  app.use(i18n)
}
