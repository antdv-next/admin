import type { App } from 'vue'
import { createI18n } from 'vue-i18n'
import messages from 'virtual:i18n-messages'
import { useLocale } from '@/composables/locale'
import { DEFAULT_LOCALE } from '@/constants/locale'

export const setupI18n = async (app: App) => {
  const { setI18n, locale, changeLocale } = useLocale()
  const i18n = createI18n({
    locale: DEFAULT_LOCALE,
    fallbackLocale: DEFAULT_LOCALE,
    messages: {
      [DEFAULT_LOCALE]: messages,
    },
    legacy: false,
  })
  setI18n(i18n)
  // 恢复用户上次选择的语言（非默认语言时会懒加载对应语言包）
  await changeLocale(locale.value)
  app.use(i18n)
}
