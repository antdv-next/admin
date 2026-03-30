import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vite-plus/test'

describe('mock guard source', () => {
  it('excludes mock test files from runtime eager imports', () => {
    const source = readFileSync(resolve(process.cwd(), 'src/utils/request/guard/mock.ts'), 'utf8')

    expect(source).toContain('!../../../../mock/**/*.spec.ts')
    expect(source).toContain('!../../../../mock/**/*.test.ts')
    expect(source).toContain('!../../../../mock/**/__tests__/**/*.ts')
  })

  it('excludes mock test files from the app tsconfig include set', () => {
    const source = readFileSync(resolve(process.cwd(), 'tsconfig.app.json'), 'utf8')

    expect(source).toContain('"mock/**/*.spec.ts"')
    expect(source).toContain('"mock/**/*.test.ts"')
    expect(source).toContain('"mock/**/__tests__/**/*.ts"')
  })
})
