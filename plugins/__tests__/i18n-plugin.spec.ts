import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vite-plus/test'
import { shouldGenerateJsonAssets } from '../i18n'
import { mergeMessageTrees } from '../i18n/merge'
import { normalizeNamespaceSegments } from '../i18n/namespace'
import { resolveI18nPluginOptions } from '../i18n/options'
import { createI18nRuntimeModuleCode } from '../i18n/runtime'
import { scanLocaleSources } from '../i18n/scan'

function createTempRoot() {
  return mkdtempSync(join(tmpdir(), 'antdv-next-i18n-'))
}

function write(root: string, filePath: string, content = 'export default {}') {
  const fullPath = join(root, filePath)
  mkdirSync(join(fullPath, '..'), { recursive: true })
  writeFileSync(fullPath, content, 'utf8')
}

describe('normalizeNamespaceSegments', () => {
  it('collapses trailing index segments and normalizes route params', () => {
    expect(normalizeNamespaceSegments(['workspace', 'overview', 'index'])).toEqual([
      'workspace',
      'overview',
    ])
    expect(normalizeNamespaceSegments(['user', '[id]'])).toEqual(['user', '$id'])
    expect(normalizeNamespaceSegments(['user', '[[slug]]', 'edit'])).toEqual([
      'user',
      '$slug',
      'edit',
    ])
    expect(normalizeNamespaceSegments(['docs', '[...all]'])).toEqual(['docs', '$all'])
  })
})

describe('scanLocaleSources', () => {
  const roots: string[] = []

  afterEach(() => {
    roots.length = 0
  })

  it('discovers src and app locale sources with normalized namespace paths', () => {
    const root = createTempRoot()
    roots.push(root)
    write(root, 'src/locales/zh-CN/workspace/overview/index.ts')
    write(root, 'src/locales/en-US/workspace/overview.ts')
    write(root, 'src/locales/zh-CN/index.ts', '// ignored')
    write(root, 'src/pages/user/[id]/locales/zh-CN.ts')
    write(root, 'apps/admin/locales/zh-CN/workspace/overview.ts')
    write(root, 'apps/admin/pages/error/locales/en-US.ts')

    const sources = scanLocaleSources(
      root,
      resolveI18nPluginOptions({
        locales: ['zh-CN', 'en-US'],
      }),
    )

    expect(
      sources.map(source => ({
        locale: source.locale,
        namespace: source.namespaceSegments.join('.'),
        kind: source.kind,
      })),
    ).toEqual([
      {
        locale: 'en-US',
        namespace: 'workspace.overview',
        kind: 'src-locales',
      },
      {
        locale: 'zh-CN',
        namespace: 'workspace.overview',
        kind: 'src-locales',
      },
      {
        locale: 'zh-CN',
        namespace: 'user.$id',
        kind: 'src-pages',
      },
      {
        locale: 'zh-CN',
        namespace: 'admin.workspace.overview',
        kind: 'app-locales',
      },
      {
        locale: 'en-US',
        namespace: 'admin.error',
        kind: 'app-pages',
      },
    ])
  })

  it('rejects extra files inside page locales directories', () => {
    const root = createTempRoot()
    roots.push(root)
    write(root, 'src/pages/error/locales/zh-CN.ts')
    write(root, 'src/pages/error/locales/common.ts')

    expect(() =>
      scanLocaleSources(
        root,
        resolveI18nPluginOptions({
          locales: ['zh-CN', 'en-US'],
        }),
      ),
    ).toThrowError(/page locales/i)
  })
})

describe('mergeMessageTrees', () => {
  it('deep merges plain objects without replacing nested branches', () => {
    expect(
      mergeMessageTrees(
        {
          workspace: {
            overview: {
              title: 'Overview',
            },
          },
        },
        {
          workspace: {
            overview: {
              description: 'Description',
            },
          },
        },
      ),
    ).toEqual({
      workspace: {
        overview: {
          title: 'Overview',
          description: 'Description',
        },
      },
    })
  })

  it('throws when duplicate leaf keys would overwrite each other', () => {
    expect(() =>
      mergeMessageTrees(
        {
          workspace: {
            overview: {
              title: 'Overview',
            },
          },
        },
        {
          workspace: {
            overview: {
              title: 'Duplicate',
            },
          },
        },
      ),
    ).toThrowError(/workspace\.overview\.title/)
  })

  it('throws when arrays participate in a merge collision', () => {
    expect(() =>
      mergeMessageTrees(
        {
          workspace: {
            tabs: ['a'],
          },
        },
        {
          workspace: {
            tabs: ['b'],
          },
        },
      ),
    ).toThrowError(/workspace\.tabs/)
  })
})

describe('createI18nRuntimeModuleCode', () => {
  it('eagerly exports only the default locale and lazy loads the rest', () => {
    const code = createI18nRuntimeModuleCode(
      [
        {
          filePath: '/repo/src/locales/zh-CN/antd.ts',
          importPath: '/repo/src/locales/zh-CN/antd.ts',
          locale: 'zh-CN',
          kind: 'src-locales',
          namespaceSegments: ['antd'],
        },
        {
          filePath: '/repo/src/pages/error/locales/zh-CN.ts',
          importPath: '/repo/src/pages/error/locales/zh-CN.ts',
          locale: 'zh-CN',
          kind: 'src-pages',
          namespaceSegments: ['error'],
        },
        {
          filePath: '/repo/src/locales/en-US/antd.ts',
          importPath: '/repo/src/locales/en-US/antd.ts',
          locale: 'en-US',
          kind: 'src-locales',
          namespaceSegments: ['antd'],
        },
      ],
      'zh-CN',
    )

    expect(code).toContain('import source0 from "/repo/src/locales/zh-CN/antd.ts"')
    expect(code).toContain('import source1 from "/repo/src/pages/error/locales/zh-CN.ts"')
    expect(code).not.toContain('import source2 from "/repo/src/locales/en-US/antd.ts"')
    expect(code).toContain('const defaultMessages = buildMessages(')
    expect(code).toContain('const loaders: Record<string, LocaleLoaderRecord[]> = {')
    expect(code).toContain('const loadI18n = async (locale: string) => {')
    expect(code).toContain('["zh-CN", defaultMessages]')
    expect(code).toContain('() => import("/repo/src/locales/en-US/antd.ts")')
  })
})

describe('shouldGenerateJsonAssets', () => {
  it('only enables json generation for production builds when json output is configured', () => {
    expect(
      shouldGenerateJsonAssets({
        command: 'build',
        mode: 'production',
        json: {
          outDir: 'public/locales',
          fileName: (locale: string) => `${locale}.json`,
        },
      }),
    ).toBe(true)

    expect(
      shouldGenerateJsonAssets({
        command: 'serve',
        mode: 'development',
        json: {
          outDir: 'public/locales',
          fileName: (locale: string) => `${locale}.json`,
        },
      }),
    ).toBe(false)

    expect(
      shouldGenerateJsonAssets({
        command: 'build',
        mode: 'development',
        json: {
          outDir: 'public/locales',
          fileName: (locale: string) => `${locale}.json`,
        },
      }),
    ).toBe(false)

    expect(
      shouldGenerateJsonAssets({
        command: 'build',
        mode: 'production',
        json: false,
      }),
    ).toBe(false)
  })
})
