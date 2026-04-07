import { describe, expect, it } from 'vite-plus/test'
import { buildLocaleMessages, createLocaleJsonOutputs } from '../i18n/json'
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

describe('buildLocaleMessages', () => {
  it('merges namespace-wrapped locale modules into one locale tree', () => {
    const messages = buildLocaleMessages([
      {
        namespaceSegments: ['workspace', 'overview'],
        value: {
          title: 'Overview',
        },
      },
      {
        namespaceSegments: ['error'],
        value: {
          title: 'Error',
        },
      },
      {
        namespaceSegments: ['admin', 'user', '$id'],
        value: {
          title: 'Admin User',
        },
      },
    ])

    expect(messages).toEqual({
      workspace: {
        overview: {
          title: 'Overview',
        },
      },
      error: {
        title: 'Error',
      },
      admin: {
        user: {
          $id: {
            title: 'Admin User',
          },
        },
      },
    })
  })
})

describe('createLocaleJsonOutputs', () => {
  it('builds one pretty-printed json output per locale', () => {
    const outputs = createLocaleJsonOutputs(
      [
        source({
          filePath: '/repo/src/locales/zh-CN/workspace/overview.ts',
          locale: 'zh-CN',
          namespaceSegments: ['workspace', 'overview'],
          kind: 'src-locales',
        }),
        source({
          filePath: '/repo/src/pages/error/locales/zh-CN.ts',
          locale: 'zh-CN',
          namespaceSegments: ['error'],
          kind: 'src-pages',
        }),
        source({
          filePath: '/repo/src/locales/en-US/workspace/overview.ts',
          locale: 'en-US',
          namespaceSegments: ['workspace', 'overview'],
          kind: 'src-locales',
        }),
      ],
      new Map([
        [
          '/repo/src/locales/zh-CN/workspace/overview.ts',
          {
            title: '概览',
          },
        ],
        [
          '/repo/src/pages/error/locales/zh-CN.ts',
          {
            title: '错误页',
          },
        ],
        [
          '/repo/src/locales/en-US/workspace/overview.ts',
          {
            title: 'Overview',
          },
        ],
      ]),
      {
        outDir: 'public/locales',
        fileName: locale => `${locale}.json`,
      },
    )

    expect(outputs).toEqual([
      {
        locale: 'en-US',
        filePath: 'public/locales/en-US.json',
        content:
          '{\n  "workspace": {\n    "overview": {\n      "title": "Overview"\n    }\n  }\n}\n',
      },
      {
        locale: 'zh-CN',
        filePath: 'public/locales/zh-CN.json',
        content:
          '{\n  "error": {\n    "title": "错误页"\n  },\n  "workspace": {\n    "overview": {\n      "title": "概览"\n    }\n  }\n}\n',
      },
    ])
  })
})
