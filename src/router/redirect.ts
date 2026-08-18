import { AUTH_DEFAULT_PATH, LOGIN_PATH, UNAUTH_DEFAULT_PATH } from '@/constants/router'

export interface ResolveAuthGuardRedirectOptions {
  isAuthenticated: boolean
  isPublicRoute: boolean
  toPath: string
}

export function getDefaultEntryPath(isAuthenticated: boolean) {
  return isAuthenticated ? AUTH_DEFAULT_PATH : UNAUTH_DEFAULT_PATH
}

/**
 * 解析登录成功后的跳转地址：仅接受站内路径，其他情况回落默认已登录入口，
 * 避免开放重定向或回跳到登录页本身。
 */
export function resolveLoginSuccessPath(redirect: unknown) {
  if (
    typeof redirect === 'string' &&
    redirect.startsWith('/') &&
    !redirect.startsWith('//') &&
    redirect !== LOGIN_PATH &&
    !redirect.startsWith(`${LOGIN_PATH}?`)
  ) {
    return redirect
  }

  return AUTH_DEFAULT_PATH
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
