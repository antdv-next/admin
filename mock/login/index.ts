import type { MockContext } from '../index'
import { defineMock, response } from '../index'

const MOCK_USER = {
  id: 'mock-admin',
  name: 'Admin',
  email: 'admin',
  roles: ['admin'],
}

export default defineMock({
  POST({ data }: MockContext) {
    const payload = typeof data === 'object' && data !== null ? data as Record<string, unknown> : {}
    const email = String(payload.email ?? '')
    const password = String(payload.password ?? '')

    if (email !== 'admin' || password !== 'admin') {
      return response({
        code: 401,
        data: null,
        msg: '账号或密码错误',
      }, {
        delay: 300,
      })
    }

    return response({
      code: 0,
      data: {
        token: 'mock-token-admin',
        user: MOCK_USER,
      },
      msg: '登录成功',
    }, {
      delay: 300,
    })
  },
})
