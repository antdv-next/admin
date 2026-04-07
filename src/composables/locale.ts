import type { I18n } from 'vue-i18n'

export const useLocale = createGlobalState(() => {
  let i18n: I18n | undefined = undefined
  const setI18n = (instance: I18n) => {
    i18n = instance
  }
  return {
    i18n,
    setI18n,
  }
})
