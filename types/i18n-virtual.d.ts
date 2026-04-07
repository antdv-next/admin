declare module 'virtual:i18n-messages' {
  const messages: import('./i18n').GeneratedI18nSchema
  export function loadI18n(locale: string): Promise<import('./i18n').GeneratedI18nSchema>
  export default messages
}
