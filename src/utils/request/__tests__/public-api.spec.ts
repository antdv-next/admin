import { describe, expect, it } from 'vite-plus/test'
import * as request from '..'

describe('request public api', () => {
  it('exposes alova-native utilities instead of legacy helpers', () => {
    expect(request.http).toBeTruthy()
    expect(request.useAlovaRequest).toBeTypeOf('function')
    expect(request.useAlovaWatcher).toBeTypeOf('function')
    expect('tryIt' in request).toBe(false)
    expect('useGet' in request).toBe(false)
    expect('usePost' in request).toBe(false)
    expect('usePut' in request).toBe(false)
    expect('useDelete' in request).toBe(false)
    expect('usePatch' in request).toBe(false)
  })

  it('configures vue states hook on the shared alova instance', () => {
    expect(request.http.options.statesHook).toMatchObject({
      name: 'Vue',
    })
  })
})
