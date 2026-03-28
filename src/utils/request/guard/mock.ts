import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
  RawAxiosResponseHeaders,
} from 'axios'
import { AxiosError } from 'axios'
import type {
  MockContext,
  MockDefinition,
  MockHandlerValue,
  MockMethod,
  ResolvedMockResponse,
} from '../../../../mock'
import { MOCK_METHODS } from '../../../../mock'
import type { RequestConfig } from '../interface'

interface MockMatcher {
  handler: MockHandlerValue
  method: MockMethod
  path: string
}

const DEFAULT_ORIGIN = 'http://localhost'
const MOCK_MODULES = import.meta.glob('../../../../mock/**/*.ts', { eager: true }) as Record<
  string,
  {
    default?: MockDefinition
  }
>
const MOCK_REGISTRY = createMockRegistry()

export function setupMockGuard(http: AxiosInstance) {
  http.interceptors.request.use(config => {
    if (!isMockEnabled(config as RequestConfig)) return config

    const matchedMock = findMock(config)
    if (!matchedMock) return config

    config.adapter = async () => {
      const context = createMockContext(config, matchedMock)
      const resolved = await resolveMock(context, matchedMock.handler)
      const headers = {
        'content-type': 'application/json',
        ...resolved.headers,
      } as RawAxiosResponseHeaders
      if (resolved.delay && resolved.delay > 0) {
        await sleep(resolved.delay)
      }

      const response = {
        config,
        data: resolved.body,
        headers,
        request: { mocked: true, path: matchedMock.path },
        status: resolved.status ?? 200,
        statusText: resolved.statusText ?? 'OK',
      } satisfies AxiosResponse

      return settleMockResponse(response)
    }

    return config
  })
}

function isMockEnabled(config: RequestConfig) {
  if (typeof config.meta?.mock === 'boolean') return config.meta.mock

  return import.meta.env.VITE_APP_MOCK_ENABLED === 'true'
}

function createMockRegistry() {
  const registry = new Map<string, Partial<Record<MockMethod, MockHandlerValue>>>()

  for (const [filePath, module] of Object.entries(MOCK_MODULES)) {
    const routePath = toRoutePath(filePath)
    if (!routePath || !module.default) continue

    const routeRecord = registry.get(routePath) ?? {}
    for (const [methodKey, handler] of Object.entries(module.default)) {
      const method = toMethod(methodKey)
      if (!method) continue
      routeRecord[method] = handler
    }
    registry.set(routePath, routeRecord)
  }

  return registry
}

function findMock(config: InternalAxiosRequestConfig): MockMatcher | null {
  const method = toMethod(config.method)
  if (!method) return null

  const requestPath = normalizePath(
    stripBasePath(resolveRequestPath(config), resolveBasePath(config.baseURL)),
  )
  const routeRecord = MOCK_REGISTRY.get(requestPath)
  const handler = routeRecord?.[method]
  if (!handler) return null

  return {
    handler,
    method,
    path: requestPath,
  }
}

function createMockContext(
  config: InternalAxiosRequestConfig,
  matchedMock: MockMatcher,
): MockContext {
  const requestUrl = resolveRequestUrl(config)
  const parsedUrl = new URL(requestUrl, getOrigin())

  for (const [key, value] of Object.entries(config.params ?? {})) {
    appendQueryValue(parsedUrl.searchParams, key, value)
  }

  return {
    config,
    data: normalizeBody(config.data),
    headers: normalizeHeaders(config),
    method: matchedMock.method,
    params: { ...(config.params ?? {}) },
    path: matchedMock.path,
    query: readQuery(parsedUrl.searchParams),
    url: parsedUrl.toString(),
  }
}

async function resolveMock(
  context: MockContext,
  handler: MockHandlerValue,
): Promise<ResolvedMockResponse> {
  const result = typeof handler === 'function' ? await handler(context) : handler

  if (isResolvedMockResponse(result)) return result

  return {
    __mockResponse: true,
    body: result,
  }
}

function toRoutePath(filePath: string) {
  const relativePath = filePath.replace(/\\/g, '/').split('/mock/')[1]
  if (!relativePath || relativePath === 'index.ts') return null

  const routePath = relativePath.endsWith('/index.ts')
    ? relativePath.replace(/\/index\.ts$/, '')
    : relativePath.replace(/\.ts$/, '')

  return normalizePath(`/${routePath}`)
}

function resolveRequestPath(config: InternalAxiosRequestConfig) {
  const requestUrl = resolveRequestUrl(config)
  return new URL(requestUrl, getOrigin()).pathname
}

function resolveRequestUrl(config: InternalAxiosRequestConfig) {
  return config.url ?? '/'
}

function resolveBasePath(baseURL?: string) {
  if (!baseURL) return ''
  return new URL(baseURL, getOrigin()).pathname
}

function stripBasePath(pathname: string, basePath: string) {
  if (!basePath || basePath === '/' || pathname === basePath)
    return pathname === basePath ? '/' : pathname

  if (pathname.startsWith(`${basePath}/`)) {
    return pathname.slice(basePath.length)
  }

  return pathname
}

function normalizePath(path: string) {
  const normalized = `/${path}`.replace(/\/+/g, '/').replace(/\/$/, '')
  return normalized || '/'
}

function toMethod(method?: string | null) {
  if (!method) return null

  const normalizedMethod = method.toUpperCase()
  return MOCK_METHODS.find(item => item === normalizedMethod) ?? null
}

function normalizeHeaders(config: InternalAxiosRequestConfig) {
  const rawHeaders =
    typeof config.headers?.toJSON === 'function' ? config.headers.toJSON() : config.headers

  return Object.fromEntries(
    Object.entries(rawHeaders ?? {}).map(([key, value]) => [key, String(value)]),
  )
}

function normalizeBody(data: unknown) {
  if (typeof data === 'string') {
    try {
      return JSON.parse(data)
    } catch {
      return data
    }
  }

  if (typeof FormData !== 'undefined' && data instanceof FormData) {
    return Object.fromEntries(data.entries())
  }

  if (typeof URLSearchParams !== 'undefined' && data instanceof URLSearchParams) {
    return Object.fromEntries(data.entries())
  }

  return data
}

function readQuery(searchParams: URLSearchParams) {
  const query: Record<string, string | string[]> = {}

  for (const [key, value] of searchParams.entries()) {
    const previousValue = query[key]
    if (previousValue === undefined) {
      query[key] = value
      continue
    }
    query[key] = Array.isArray(previousValue) ? [...previousValue, value] : [previousValue, value]
  }

  return query
}

function appendQueryValue(searchParams: URLSearchParams, key: string, value: unknown) {
  if (value == null) return

  if (Array.isArray(value)) {
    for (const item of value) {
      appendQueryValue(searchParams, key, item)
    }
    return
  }

  if (value instanceof Date) {
    searchParams.append(key, value.toISOString())
    return
  }

  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'bigint'
  ) {
    searchParams.append(key, String(value))
    return
  }

  searchParams.append(key, JSON.stringify(value))
}

function isResolvedMockResponse(value: unknown): value is ResolvedMockResponse {
  return typeof value === 'object' && value !== null && '__mockResponse' in value
}

function settleMockResponse(response: AxiosResponse) {
  const validateStatus = response.config.validateStatus
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    return response
  }

  throw new AxiosError(
    `Request failed with status code ${response.status}`,
    response.status >= 500 ? AxiosError.ERR_BAD_RESPONSE : AxiosError.ERR_BAD_REQUEST,
    response.config,
    response.request,
    response,
  )
}

function sleep(delay: number) {
  return new Promise(resolve => setTimeout(resolve, delay))
}

function getOrigin() {
  return typeof window !== 'undefined' ? window.location.origin : DEFAULT_ORIGIN
}
