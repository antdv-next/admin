import { nextTick } from 'vue'
import type { I18n } from 'vue-i18n'
import { loadI18n } from 'virtual:i18n-messages'
import { DEFAULT_LOCALE, isSupportLocale } from '@/constants/locale'
import type { SupportLocale } from '@/constants/locale'

type AppI18n = I18n<any, any, any, string, boolean>

export const useLocale = createGlobalState(() => {
  let i18n: AppI18n | undefined = undefined
  const storedLocale = useStorage<SupportLocale>('antdv-locale', DEFAULT_LOCALE)
  if (!isSupportLocale(storedLocale.value)) {
    storedLocale.value = DEFAULT_LOCALE
  }
  const locale = computed(() => storedLocale.value)

  const setI18n = (instance: AppI18n) => {
    i18n = instance
  }

  const setI18nLanguage = (language: string) => {
    if (i18n && i18n.global) {
      ;(i18n as any).global.locale.value = language
    }
    document.documentElement.setAttribute('lang', language)
  }

  const loadLocaleMessage = async (lang: string) => {
    if (!i18n) return
    if (!i18n.global.availableLocales.includes(lang)) {
      const messages = await loadI18n(lang)
      i18n.global.setLocaleMessage(lang, messages)
    }

    return nextTick()
  }

  const changeLocale = async (lang: SupportLocale) => {
    await loadLocaleMessage(lang)
    setI18nLanguage(lang)
    storedLocale.value = lang
  }

  return {
    i18n,
    locale,
    setI18n,
    setI18nLanguage,
    loadLocaleMessage,
    changeLocale,
  }
})
