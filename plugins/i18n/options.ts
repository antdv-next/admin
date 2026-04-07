export interface I18nPluginJsonOptions {
  outDir?: string
  fileName?: (locale: string) => string
}

export interface I18nPluginIncludeOptions {
  srcLocales?: boolean
  srcPages?: boolean
  appLocales?: boolean
  appPages?: boolean
}

export interface I18nPluginOptions {
  locales?: string[]
  defaultLocale?: string
  dts?: string | false
  json?: false | I18nPluginJsonOptions
  strict?: boolean
  include?: I18nPluginIncludeOptions
}

export interface ResolvedI18nPluginOptions {
  locales: string[]
  defaultLocale: string
  dts: string | false
  json: false | Required<I18nPluginJsonOptions>
  strict: boolean
  include: Required<I18nPluginIncludeOptions>
}

export function resolveI18nPluginOptions(
  options: I18nPluginOptions = {},
): ResolvedI18nPluginOptions {
  const locales = options.locales?.length ? [...new Set(options.locales)] : ['zh-CN', 'en-US']
  const defaultLocale = options.defaultLocale ?? locales[0] ?? 'zh-CN'

  if (!locales.includes(defaultLocale)) {
    throw new Error(
      `[i18n] defaultLocale "${defaultLocale}" must be included in locales: ${locales.join(', ')}`,
    )
  }

  return {
    locales,
    defaultLocale,
    dts: options.dts ?? 'types/i18n.d.ts',
    json: options.json
      ? {
          outDir: options.json.outDir ?? 'public/locales',
          fileName: options.json.fileName ?? (locale => `${locale}.json`),
        }
      : false,
    strict: options.strict ?? true,
    include: {
      srcLocales: options.include?.srcLocales ?? true,
      srcPages: options.include?.srcPages ?? true,
      appLocales: options.include?.appLocales ?? true,
      appPages: options.include?.appPages ?? true,
    },
  }
}
