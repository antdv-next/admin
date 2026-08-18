// 默认语言，同时是 i18n 插件的基准语言（构建期打包，其他语言运行时懒加载）
export const DEFAULT_LOCALE = 'zh-CN'

// 支持的语言列表，新增语言时同步更新 plugins/i18n 的 locales 配置
export const SUPPORT_LOCALES = [
  { label: '简体中文', value: 'zh-CN' },
  { label: 'English', value: 'en-US' },
] as const

export type SupportLocale = (typeof SUPPORT_LOCALES)[number]['value']

export function isSupportLocale(value: unknown): value is SupportLocale {
  return SUPPORT_LOCALES.some(item => item.value === value)
}
