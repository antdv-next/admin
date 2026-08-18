import { createAlovaMockAdapter } from '@alova/mock'
import type { MockWrapper } from '@alova/mock'
import { createAlova } from 'alova'
import adapterFetch from 'alova/fetch'
import VueHook from 'alova/vue'
import { useApp } from '@/composables/app'
import { useUserStore } from '@/stores/user'
import { AUTHORIZATION_KEY } from './constant'
import type { RequestMeta } from './interface'
import { handleSessionExpired } from './session'

interface CreateRequestClientOptions {
  customFetch?: typeof fetch
}

const MOCK_MODULES = import.meta.glob(
  [
    '../../../mock/**/*.ts',
    '!../../../mock/**/*.spec.ts',
    '!../../../mock/**/*.test.ts',
    '!../../../mock/**/__tests__/**/*.ts',
    '!../../../mock/**/seeds/**/*.ts',
  ],
  { eager: true },
) as Record<
  string,
  {
    default?: MockWrapper
  }
>

class AlovaRequestError<T = unknown> extends Error {
  data?: T
  status: number
  statusText: string
  /** 会话失效等已经统一提示过的错误，不再重复弹出全局提示 */
  silent: boolean

  constructor(
    message: string,
    options: { data?: T; silent?: boolean; status: number; statusText: string },
  ) {
    super(message)
    this.name = 'RequestError'
    this.data = options.data
    this.silent = options.silent ?? false
    this.status = options.status
    this.statusText = options.statusText
  }
}

const SUCCESS_BUSINESS_CODE = 200
const UNAUTHORIZED_BUSINESS_CODE = 401

function resolveBusinessCode(payload: unknown) {
  if (typeof payload === 'object' && payload !== null && 'code' in payload) {
    const code = (payload as { code: unknown }).code
    return typeof code === 'number' ? code : undefined
  }
  return undefined
}

export function createRequestClient(options: CreateRequestClientOptions = {}) {
  const realtimeAdapter = adapterFetch({
    customFetch: options.customFetch,
  })
  const mockAdapter = createAlovaMockAdapter(loadMockWrappers(), {
    delay: 0,
    httpAdapter: realtimeAdapter,
    matchMode: 'methodurl',
  })
  const requestAdapter = (
    elements: Parameters<typeof realtimeAdapter>[0],
    method: Parameters<typeof realtimeAdapter>[1],
  ) => {
    return shouldUseMock(method.config.meta)
      ? mockAdapter(elements, method)
      : realtimeAdapter(elements, method)
  }

  return createAlova({
    baseURL: import.meta.env.VITE_APP_BASE_API || '/api',
    requestAdapter,
    shareRequest: true,
    statesHook: VueHook,
    async beforeRequest(method) {
      if (method.config.meta?.token === false) {
        return
      }

      const userStore = useUserStore()
      if (!userStore.token) {
        return
      }
      method.config.headers = {
        ...(method.config.headers ?? {}),
        [AUTHORIZATION_KEY]: `Bearer ${userStore.token}`,
      }
    },
    responded: {
      async onSuccess(response) {
        const contentType = response.headers.get('content-type') ?? ''
        const isJson = contentType.includes('application/json')
        const payload = isJson ? await response.json() : response
        const businessCode = resolveBusinessCode(payload)
        const isUnauthorized =
          response.status === UNAUTHORIZED_BUSINESS_CODE ||
          businessCode === UNAUTHORIZED_BUSINESS_CODE

        if (isUnauthorized) {
          const requestError = new AlovaRequestError(
            resolveErrorMessage(payload, '登录已过期，请重新登录'),
            {
              data: payload,
              silent: true,
              status: response.status,
              statusText: response.statusText,
            },
          )
          await handleSessionExpired()
          throw requestError
        }

        if (!response.ok) {
          const requestError = new AlovaRequestError(
            resolveErrorMessage(payload, `${response.status} ${response.statusText}`),
            {
              data: payload,
              status: response.status,
              statusText: response.statusText,
            },
          )
          await reportRequestError(requestError)
          throw requestError
        }

        if (businessCode !== undefined && businessCode !== SUCCESS_BUSINESS_CODE) {
          const requestError = new AlovaRequestError(
            resolveErrorMessage(payload, `Request failed with code ${businessCode}`),
            {
              data: payload,
              status: response.status,
              statusText: response.statusText,
            },
          )
          await reportRequestError(requestError)
          throw requestError
        }

        return payload
      },
      async onError(error) {
        await reportRequestError(error)
      },
    },
  })
}

export const http = createRequestClient()

function loadMockWrappers() {
  return Object.values(MOCK_MODULES)
    .map(module => module.default)
    .filter((module): module is MockWrapper => Boolean(module))
}

function isMockEnabled() {
  return import.meta.env.VITE_APP_MOCK_ENABLED === 'true'
}

function shouldUseMock(meta?: RequestMeta) {
  if (typeof meta?.mock === 'boolean') {
    return meta.mock
  }

  return isMockEnabled()
}

async function reportRequestError(error: unknown) {
  const { message } = useApp()

  if (error instanceof AlovaRequestError) {
    if (!error.silent) {
      message.error(resolveErrorMessage(error.data, error.message))
    }
    return
  }

  if (error instanceof Error) {
    message.error(error.message || 'Server Error')
    return
  }

  message.error('Server Error')
}

function resolveErrorMessage(data: unknown, fallback: string) {
  if (typeof data === 'object' && data !== null && 'msg' in data && typeof data.msg === 'string') {
    return data.msg
  }

  return fallback
}

export type { RequestMeta } from './interface'
export { AlovaRequestError as RequestError }
