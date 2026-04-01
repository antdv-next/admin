import { describe, expect, it } from 'vite-plus/test'
import { loadBuild } from '../build'

describe('loadBuild', () => {
  it('groups framework, ui, and shared code with a higher split threshold', () => {
    const build = loadBuild()
    const output = build.rolldownOptions?.output
    const normalizedOutput = Array.isArray(output) ? output[0] : output
    const codeSplitting = normalizedOutput?.codeSplitting

    expect(codeSplitting).toMatchObject({
      minSize: 20_000,
      groups: expect.arrayContaining([
        expect.objectContaining({
          name: 'framework',
          priority: 30,
        }),
        expect.objectContaining({
          name: 'ui',
          priority: 20,
        }),
        expect.objectContaining({
          name: 'ui-icons',
          priority: 25,
        }),
        expect.objectContaining({
          name: 'common',
          priority: 10,
          minShareCount: 2,
          minSize: 30_000,
        }),
      ]),
    })
  })
})
