import { AUTH_DEFAULT_PATH, LOGIN_PATH, UNAUTH_DEFAULT_PATH } from '@/constants/router'

export interface ResolveAuthGuardRedirectOptions {
  isAuthenticated: boolean
  isPublicRoute: boolean
  toPath: string
}

export function getDefaultEntryPath(isAuthenticated: boolean) {
  return isAuthenticated ? AUTH_DEFAULT_PATH : UNAUTH_DEFAULT_PATH
}

export function resolveAuthGuardRedirect({
  isAuthenticated,
  isPublicRoute,
  toPath,
}: ResolveAuthGuardRedirectOptions) {
  if (isAuthenticated && toPath === LOGIN_PATH) {
    return AUTH_DEFAULT_PATH
  }

  if (!isAuthenticated && !isPublicRoute) {
    return UNAUTH_DEFAULT_PATH
  }

  return undefined
}
