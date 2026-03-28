import type { MockContext } from '../index'
import { defineMock, response } from '../index'

export default defineMock({
  POST({ data }: MockContext) {
    const payload =
      typeof data === 'object' && data !== null ? (data as Record<string, unknown>) : {}
    const username = typeof payload.username === 'string' ? payload.username : ''
    const password = typeof payload.password === 'string' ? payload.password : ''

    if (username !== 'admin' || password !== 'admin') {
      return response(
        {
          code: 400,
          data: null,
          msg: '账号或密码错误',
        },
        {
          delay: 300,
          status: 400,
          statusText: 'Error',
        },
      )
    }

    return response(
      {
        code: 0,
        data: {
          token: 'mock-token-admin',
        },
        msg: '登录成功',
      },
      {
        delay: 3000,
      },
    )
  },
})
