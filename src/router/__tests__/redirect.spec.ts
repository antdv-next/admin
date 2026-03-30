import { describe, expect, it } from 'vite-plus/test'
import { AUTH_DEFAULT_PATH, LOGIN_PATH, UNAUTH_DEFAULT_PATH } from '@/constants/router'
import { getDefaultEntryPath, resolveAuthGuardRedirect } from '@/router/redirect'

describe('getDefaultEntryPath', () => {
  it('returns the public home path when user is not authenticated', () => {
    expect(getDefaultEntryPath(false)).toBe(UNAUTH_DEFAULT_PATH)
  })

  it('returns the configured auth default path when user is authenticated', () => {
    expect(getDefaultEntryPath(true)).toBe(AUTH_DEFAULT_PATH)
  })
})

describe('resolveAuthGuardRedirect', () => {
  it('redirects unauthenticated users away from protected routes to the public default path', () => {
    expect(
      resolveAuthGuardRedirect({
        isAuthenticated: false,
        isPublicRoute: false,
        toPath: '/admin',
      }),
    ).toBe(UNAUTH_DEFAULT_PATH)
  })

  it('allows unauthenticated users to stay on public routes including login', () => {
    expect(
      resolveAuthGuardRedirect({
        isAuthenticated: false,
        isPublicRoute: true,
        toPath: LOGIN_PATH,
      }),
    ).toBeUndefined()
  })

  it('redirects authenticated users away from the login page to the auth default path', () => {
    expect(
      resolveAuthGuardRedirect({
        isAuthenticated: true,
        isPublicRoute: true,
        toPath: LOGIN_PATH,
      }),
    ).toBe(AUTH_DEFAULT_PATH)
  })

  it('does not redirect authenticated users on non-login routes', () => {
    expect(
      resolveAuthGuardRedirect({
        isAuthenticated: true,
        isPublicRoute: false,
        toPath: '/admin/users',
      }),
    ).toBeUndefined()
  })
})
