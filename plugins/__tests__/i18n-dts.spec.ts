import { describe, expect, it } from 'vite-plus/test'
import { createI18nDts, validateLocaleSchemas } from '../i18n/dts'
import type { LocaleSource } from '../i18n/scan'

function source(
  partial: Partial<LocaleSource> &
    Pick<LocaleSource, 'filePath' | 'locale' | 'namespaceSegments' | 'kind'>,
): LocaleSource {
  return {
    appName: partial.appName,
    importPath: partial.importPath ?? partial.filePath,
    ...partial,
  }
}

describe('validateLocaleSchemas', () => {
  it('throws when a non-baseline locale is missing a namespace path', () => {
    expect(() =>
      validateLocaleSchemas(
        [
          source({
            filePath: '/repo/src/locales/zh-CN/workspace/overview.ts',
            importPath: '/repo/src/locales/zh-CN/workspace/overview.ts',
            locale: 'zh-CN',
            namespaceSegments: ['workspace', 'overview'],
            kind: 'src-locales',
          }),
        ],
        'zh-CN',
      ),
    ).not.toThrow()

    expect(() =>
      validateLocaleSchemas(
        [
          source({
            filePath: '/repo/src/locales/zh-CN/workspace/overview.ts',
            importPath: '/repo/src/locales/zh-CN/workspace/overview.ts',
            locale: 'zh-CN',
            namespaceSegments: ['workspace', 'overview'],
            kind: 'src-locales',
          }),
          source({
            filePath: '/repo/src/locales/en-US/antd.ts',
            importPath: '/repo/src/locales/en-US/antd.ts',
            locale: 'en-US',
            namespaceSegments: ['antd'],
            kind: 'src-locales',
          }),
        ],
        'zh-CN',
      ),
    ).toThrowError(/workspace\.overview/)
  })
})

describe('createI18nDts', () => {
  it('creates schema and locale equality assertions from source files', () => {
    const dts = createI18nDts(
      [
        source({
          filePath: '/repo/src/locales/zh-CN/workspace/overview.ts',
          importPath: '/repo/src/locales/zh-CN/workspace/overview.ts',
          locale: 'zh-CN',
          namespaceSegments: ['workspace', 'overview'],
          kind: 'src-locales',
        }),
        source({
          filePath: '/repo/src/pages/error/locales/zh-CN.ts',
          importPath: '/repo/src/pages/error/locales/zh-CN.ts',
          locale: 'zh-CN',
          namespaceSegments: ['error'],
          kind: 'src-pages',
        }),
        source({
          filePath: '/repo/apps/admin/pages/user/[id]/locales/zh-CN.ts',
          importPath: '/repo/apps/admin/pages/user/[id]/locales/zh-CN.ts',
          locale: 'zh-CN',
          namespaceSegments: ['admin', 'user', '$id'],
          kind: 'app-pages',
          appName: 'admin',
        }),
        source({
          filePath: '/repo/src/locales/en-US/workspace/overview.ts',
          importPath: '/repo/src/locales/en-US/workspace/overview.ts',
          locale: 'en-US',
          namespaceSegments: ['workspace', 'overview'],
          kind: 'src-locales',
        }),
        source({
          filePath: '/repo/src/pages/error/locales/en-US.ts',
          importPath: '/repo/src/pages/error/locales/en-US.ts',
          locale: 'en-US',
          namespaceSegments: ['error'],
          kind: 'src-pages',
        }),
        source({
          filePath: '/repo/apps/admin/pages/user/[id]/locales/en-US.ts',
          importPath: '/repo/apps/admin/pages/user/[id]/locales/en-US.ts',
          locale: 'en-US',
          namespaceSegments: ['admin', 'user', '$id'],
          kind: 'app-pages',
          appName: 'admin',
        }),
      ],
      {
        root: '/repo',
        dts: 'types/i18n.d.ts',
        defaultLocale: 'zh-CN',
        strict: true,
      },
    )

    expect(dts).toContain('type LocaleSchemaZhCN = MergeAll<')
    expect(dts).toContain('type LocaleSchemaEnUS = MergeAll<')
    expect(dts).toContain("typeof import('../src/locales/zh-CN/workspace/overview').default")
    expect(dts).toContain("typeof import('../src/pages/error/locales/zh-CN').default")
    expect(dts).toContain("typeof import('../apps/admin/pages/user/[id]/locales/zh-CN').default")
    expect(dts).toContain('user: {')
    expect(dts).toContain('$id')
    expect(dts).toContain("declare module 'vue-i18n'")
    expect(dts).toContain('export type GeneratedI18nSchema = LocaleSchemaZhCN')
    expect(dts).toContain('type _LocaleSchemaCheckEnUS')
  })
})
