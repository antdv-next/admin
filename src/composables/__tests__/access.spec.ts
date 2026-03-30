import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vite-plus/test'
import { useAccess } from '@/composables/access'
import { useUserStore } from '@/stores/user'

describe('useAccess', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('checks single and multiple permission codes', () => {
    const userStore = useUserStore()
    userStore.permissions = ['system:user:create', 'system:user:update']

    const access = useAccess()

    expect(access.hasAccess('system:user:create')).toBe(true)
    expect(access.hasAccess('system:user:remove')).toBe(false)
    expect(access.hasAnyAccess(['system:user:remove', 'system:user:update'])).toBe(true)
    expect(access.hasAllAccess(['system:user:create', 'system:user:update'])).toBe(true)
    expect(access.hasAllAccess(['system:user:create', 'system:user:remove'])).toBe(false)
  })
})
