import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vite-plus/test'
import type { MenuInfo } from '@/api/menu'
import type { UserInfo } from '@/api/user'

const getUserInfoMethod = vi.fn()
const getUserMenuMethod = vi.fn()

vi.mock('@/api/user', () => ({
  getUserInfoMethod,
  getUserMenuMethod,
}))

function createDeferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason?: unknown) => void

  const promise = new Promise<T>((innerResolve, innerReject) => {
    resolve = innerResolve
    reject = innerReject
  })

  return { promise, resolve, reject }
}

describe('useUserStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    getUserInfoMethod.mockReset()
    getUserMenuMethod.mockReset()
    vi.resetModules()
  })

  it('deduplicates concurrent user info requests', async () => {
    const deferred = createDeferred<{ data: UserInfo }>()
    getUserInfoMethod.mockReturnValue(deferred.promise)

    const { useUserStore } = await import('@/stores/user')
    const store = useUserStore()
    store.setToken('token')

    const firstRequest = store.fetchUserInfo()
    const secondRequest = store.fetchUserInfo()

    expect(getUserInfoMethod).toHaveBeenCalledTimes(1)
    expect(store.userInfoLoading).toBe(true)

    deferred.resolve({
      data: {
        id: '1',
        username: 'admin',
        nickname: 'Admin',
      } as UserInfo,
    })

    await expect(firstRequest).resolves.toMatchObject({
      id: '1',
      username: 'admin',
    })
    await expect(secondRequest).resolves.toMatchObject({
      id: '1',
      username: 'admin',
    })
    expect(store.userInfoLoading).toBe(false)
  })

  it('deduplicates concurrent menu requests', async () => {
    const deferred = createDeferred<{ data: MenuInfo[] }>()
    getUserMenuMethod.mockReturnValue(deferred.promise)

    const { useUserStore } = await import('@/stores/user')
    const store = useUserStore()
    store.setToken('token')

    const firstRequest = store.fetchMenus()
    const secondRequest = store.fetchMenus()

    expect(getUserMenuMethod).toHaveBeenCalledTimes(1)
    expect(store.menusLoading).toBe(true)

    deferred.resolve({
      data: [
        {
          id: 'menu-1',
          title: 'Dashboard',
          code: 'dashboard',
        },
        {
          id: 'btn-1',
          menuType: 'menu_type_btn',
          permission: 'system:user:create',
        },
        {
          id: 'btn-2',
          menuType: 'menu_type_btn',
          code: 'system:user:update',
        },
      ] as unknown as MenuInfo[],
    })

    await expect(firstRequest).resolves.toEqual([
      {
        id: 'menu-1',
        title: 'Dashboard',
        code: 'dashboard',
      },
      {
        id: 'btn-1',
        menuType: 'menu_type_btn',
        permission: 'system:user:create',
      },
      {
        id: 'btn-2',
        menuType: 'menu_type_btn',
        code: 'system:user:update',
      },
    ])
    await expect(secondRequest).resolves.toMatchObject([
      {
        id: 'menu-1',
        code: 'dashboard',
      },
      {
        id: 'btn-1',
        permission: 'system:user:create',
      },
      {
        id: 'btn-2',
        code: 'system:user:update',
      },
    ])
    expect(store.permissions).toEqual(['system:user:create', 'system:user:update'])
    expect(store.menusLoading).toBe(false)
  })

  it('loads user info and menus concurrently for auth context', async () => {
    const { useUserStore } = await import('@/stores/user')
    const store = useUserStore()
    const executionOrder: string[] = []
    const userDeferred = createDeferred<UserInfo | undefined>()
    const menuDeferred = createDeferred<MenuInfo[] | undefined>()

    store.setToken('token')
    store.ensureUserInfo = vi.fn(() => {
      executionOrder.push('user')
      return userDeferred.promise
    })
    store.ensureMenus = vi.fn(() => {
      executionOrder.push('menu')
      return menuDeferred.promise
    })

    const authContextPromise = store.ensureAuthContext()

    expect(executionOrder).toEqual(['user', 'menu'])

    userDeferred.resolve({
      id: '1',
      username: 'admin',
    } as UserInfo)
    menuDeferred.resolve([
      {
        id: 'menu-1',
        title: 'Dashboard',
        code: 'dashboard',
      },
    ] as MenuInfo[])

    await expect(authContextPromise).resolves.toEqual({
      userInfo: {
        id: '1',
        username: 'admin',
      },
      menus: [
        {
          id: 'menu-1',
          title: 'Dashboard',
          code: 'dashboard',
        },
      ],
      permissions: [],
    })
  })

  it('clears permissions on logout', async () => {
    const { useUserStore } = await import('@/stores/user')
    const store = useUserStore()

    store.setToken('token')
    store.permissions = ['system:user:create']

    store.logout()

    expect(store.permissions).toEqual([])
  })
})
