import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vite-plus/test'
import { LAYOUT_TYPES_DTS_PATH } from '../../../plugins/layout/constants'
import { generateLayoutTypeDts } from '../../../plugins/layout/generate-layout-types'
import { resolveLayoutOptions } from '../../../plugins/layout/options'

const tempDirs: string[] = []

function createTempProject() {
  const root = mkdtempSync(join(tmpdir(), 'layout-types-'))
  tempDirs.push(root)

  mkdirSync(join(root, 'src/layouts'), { recursive: true })
  mkdirSync(join(root, 'src/layouts/components'), { recursive: true })
  mkdirSync(join(root, 'apps/admin/layouts'), { recursive: true })

  writeFileSync(join(root, 'src/layouts/default.vue'), '<template />\n', 'utf8')
  writeFileSync(join(root, 'src/layouts/components/header.vue'), '<template />\n', 'utf8')
  writeFileSync(join(root, 'apps/admin/layouts/base.vue'), '<template />\n', 'utf8')

  return root
}

afterEach(() => {
  tempDirs.splice(0).forEach(dir => rmSync(dir, { recursive: true, force: true }))
})

describe('generateLayoutTypeDts', () => {
  it('supports glob exclude patterns without throwing', () => {
    const root = createTempProject()
    const options = resolveLayoutOptions({
      exclude: ['**/components/**'],
    })

    expect(() => generateLayoutTypeDts(root, options)).not.toThrow()

    const outputPath = join(root, LAYOUT_TYPES_DTS_PATH)
    expect(existsSync(outputPath)).toBe(true)

    const generated = readFileSync(outputPath, 'utf8')

    expect(generated).toContain("'default'")
    expect(generated).toContain("'admin/base'")
  })
})
