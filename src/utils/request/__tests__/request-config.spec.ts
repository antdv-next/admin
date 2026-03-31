import { describe, expect, it } from 'vite-plus/test'
import * as request from '..'

describe('request config typing', () => {
  it('accepts fetch request fields through the alova instance', () => {
    const controller = new AbortController()

    const getMethod = request.http.Get('/typed', {
      credentials: 'include',
      signal: controller.signal,
      meta: {
        mock: false,
      },
    })

    const requestMethod = request.http.Request({
      url: '/typed',
      method: 'POST',
      credentials: 'same-origin',
      signal: controller.signal,
    })

    expect(getMethod).toBeTruthy()
    expect(requestMethod).toBeTruthy()
  })
})
