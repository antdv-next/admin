import { describe, expect, it } from 'vite-plus/test'
import { loadIcons } from '../../../plugins/icons'

describe('loadIcons', () => {
  it('maps main app collections and sub-app icon roots to distinct custom collections', async () => {
    const loadedIcons = loadIcons({
      globalFallbackLayout: false,
      exclude: ['**/components/**', '**/hooks/**', '**/composables/**'],
      modules: {
        admin: {
          module: 'console',
        },
      },
    })

    expect(loadedIcons.customCollectionNames).toEqual(
      expect.arrayContaining(['common', 'app-admin']),
    )
    expect(loadedIcons.customCollectionNames).not.toContain('console')

    const commonIconLoader = loadedIcons.customCollections.common
    const adminIconLoader = loadedIcons.customCollections['app-admin']

    expect(commonIconLoader).toBeTypeOf('function')
    expect(adminIconLoader).toBeTypeOf('function')
    if (!commonIconLoader || !adminIconLoader) {
      throw new Error('Expected custom icon loaders for common and app-admin collections')
    }

    await expect(commonIconLoader('logo')).resolves.toContain('currentColor')
    await expect(adminIconLoader('logo')).resolves.toContain('currentColor')
  })
})
