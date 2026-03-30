import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vite-plus/test'

function readGeneratedRoutes() {
  return readFileSync(resolve(process.cwd(), 'types/vue-router.d.ts'), 'utf8')
}

describe('generated admin user routes', () => {
  it('includes the nested user shell and child pages', () => {
    const generatedRoutes = readGeneratedRoutes()

    expect(generatedRoutes).toContain("'apps/admin/pages/user.vue'")
    expect(generatedRoutes).toContain("'apps/admin/pages/user/index.vue'")
    expect(generatedRoutes).toContain("'apps/admin/pages/user/center.vue'")
    expect(generatedRoutes).toContain("'apps/admin/pages/user/profile.vue'")
    expect(generatedRoutes).toContain("'/admin/user'")
    expect(generatedRoutes).toContain("'/admin/user/center'")
    expect(generatedRoutes).toContain("'/admin/user/profile'")
  })
})
