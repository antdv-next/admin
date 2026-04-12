import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test'

const messageError = vi.fn()
const useUserStore = vi.fn(() => ({ token: 'mock-token' }))

vi.mock('@/composables/app', () => ({
  useApp: () => ({
    message: {
      error: messageError,
    },
  }),
}))

vi.mock('@/stores/user', () => ({
  useUserStore,
}))

describe('alova request layer', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.unstubAllEnvs()
    messageError.mockReset()
    useUserStore.mockReset()
    useUserStore.mockReturnValue({ token: 'mock-token' })
    vi.stubEnv('VITE_APP_BASE_API', '/api')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('injects authorization header by default and skips it when meta.token is false', async () => {
    vi.stubEnv('VITE_APP_MOCK_ENABLED', 'false')
    const fetchSpy = vi.fn(async () => {
      return new Response(JSON.stringify({ code: 200, data: null, msg: 'success' }), {
        headers: {
          'content-type': 'application/json',
        },
      })
    })

    const { createRequestClient } = await import('../alova')
    const client = createRequestClient({ customFetch: fetchSpy })

    await client.Get('/secure').send()
    await client.Get('/public', { meta: { token: false } }).send()

    const firstCall = fetchSpy.mock.calls[0] as [unknown, RequestInit | undefined] | undefined
    const secondCall = fetchSpy.mock.calls[1] as [unknown, RequestInit | undefined] | undefined

    expect(fetchSpy).toHaveBeenCalledTimes(2)
    expect(firstCall?.[1]).toMatchObject({
      headers: expect.objectContaining({
        Authorization: 'Bearer mock-token',
      }),
    })
    expect(secondCall?.[1]).not.toMatchObject({
      headers: expect.objectContaining({
        Authorization: expect.any(String),
      }),
    })
  })

  it('unwraps json responses and reports response body errors', async () => {
    vi.stubEnv('VITE_APP_MOCK_ENABLED', 'false')
    const fetchSpy = vi.fn(async () => {
      return new Response(JSON.stringify({ code: 400, msg: '账号或密码错误' }), {
        status: 400,
        statusText: 'Bad Request',
        headers: {
          'content-type': 'application/json',
        },
      })
    })

    const { createRequestClient, RequestError } = await import('../alova')
    const client = createRequestClient({ customFetch: fetchSpy })

    await expect(client.Get('/login').send()).rejects.toBeInstanceOf(RequestError)
    await expect(client.Get('/login').send()).rejects.toMatchObject({
      data: {
        code: 400,
        msg: '账号或密码错误',
      },
      status: 400,
    })
    expect(messageError).toHaveBeenCalledWith('账号或密码错误')
  })

  it('uses @alova/mock for matched routes and falls through to fetch for unmatched routes', async () => {
    vi.stubEnv('VITE_APP_MOCK_ENABLED', 'true')
    const fetchSpy = vi.fn(async () => {
      return new Response(JSON.stringify({ code: 200, data: { source: 'network' }, msg: 'ok' }), {
        headers: {
          'content-type': 'application/json',
        },
      })
    })

    const { createRequestClient } = await import('../alova')
    const client = createRequestClient({ customFetch: fetchSpy })

    await expect(client.Get('/test').send()).resolves.toMatchObject({
      code: 200,
      data: {
        id: 'mock-id',
      },
    })
    expect(fetchSpy).not.toHaveBeenCalled()

    await expect(client.Get('/unmatched').send()).resolves.toMatchObject({
      code: 200,
      data: {
        source: 'network',
      },
    })
    expect(fetchSpy).toHaveBeenCalledTimes(1)
  })

  it('forces mock for a single request when meta.mock is true', async () => {
    vi.stubEnv('VITE_APP_MOCK_ENABLED', 'false')
    const fetchSpy = vi.fn(async () => {
      return new Response(JSON.stringify({ code: 200, data: { source: 'network' }, msg: 'ok' }), {
        headers: {
          'content-type': 'application/json',
        },
      })
    })

    const { createRequestClient } = await import('../alova')
    const client = createRequestClient({ customFetch: fetchSpy })

    await expect(
      client
        .Get('/test', {
          meta: { mock: true },
        })
        .send(),
    ).resolves.toMatchObject({
      code: 200,
      data: {
        id: 'mock-id',
      },
    })
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('forces realtime for a single request when meta.mock is false', async () => {
    vi.stubEnv('VITE_APP_MOCK_ENABLED', 'true')
    const fetchSpy = vi.fn(async () => {
      return new Response(JSON.stringify({ code: 200, data: { source: 'network' }, msg: 'ok' }), {
        headers: {
          'content-type': 'application/json',
        },
      })
    })

    const { createRequestClient } = await import('../alova')
    const client = createRequestClient({ customFetch: fetchSpy })

    await expect(
      client
        .Get('/test', {
          meta: { mock: false },
        })
        .send(),
    ).resolves.toMatchObject({
      code: 200,
      data: {
        source: 'network',
      },
    })
    expect(fetchSpy).toHaveBeenCalledTimes(1)
  })

  it('matches dynamic mock routes for menu detail requests', async () => {
    vi.stubEnv('VITE_APP_MOCK_ENABLED', 'true')
    const fetchSpy = vi.fn(async () => {
      return new Response(JSON.stringify({ code: 200, data: { source: 'network' }, msg: 'ok' }), {
        headers: {
          'content-type': 'application/json',
        },
      })
    })

    const { createRequestClient } = await import('../alova')
    const client = createRequestClient({ customFetch: fetchSpy })

    await expect(client.Get('/admin/system/menu/9').send()).resolves.toMatchObject({
      code: 200,
      data: {
        id: '9',
        menuType: 'menu_type_menu',
        title: '菜单管理',
      },
    })
    expect(fetchSpy).not.toHaveBeenCalled()
  })
})
