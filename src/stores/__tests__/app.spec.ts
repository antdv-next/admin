import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vite-plus/test'
import { useAppStore } from '@/stores/app'

describe('useAppStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('tracks sider collapsed state and toggles it', () => {
    const store = useAppStore()

    expect(store.collapsed).toBe(false)

    store.setCollapsed(true)
    expect(store.collapsed).toBe(true)

    store.toggleCollapsed()
    expect(store.collapsed).toBe(false)
  })
})
