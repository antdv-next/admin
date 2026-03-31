import { describe, expect, it } from 'vite-plus/test'
import { loginMethod } from '../login'

describe('loginMethod', () => {
  it('creates a post method without token injection', () => {
    const method = loginMethod({
      username: 'admin',
      password: 'admin',
    })

    expect(method.type).toBe('POST')
    expect(method.url).toBe('/login')
    expect(method.config.meta).toMatchObject({
      token: false,
    })
  })
})
