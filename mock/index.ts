import type { MockServerRequest, StatusResponse } from '@alova/mock'
import { defineMock as defineAlovaMock } from '@alova/mock'

export const MOCK_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'] as const

export type MockMethod = (typeof MOCK_METHODS)[number]

export interface MockContext<T = unknown> {
  data: T
  headers: Record<string, string>
  method: MockMethod
  params: Record<string, unknown>
  path: string
  query: Record<string, string | string[]>
  url: string
}

export interface MockResponse<T = unknown> {
  body: T
  delay?: number
  headers?: Record<string, string>
  status?: number
  statusText?: string
}

export type ResolvedMockResponse = StatusResponse

export type MockHandler<T = unknown, Body = unknown> = (
  context: MockContext<Body>,
) => T | ResolvedMockResponse | Promise<T | ResolvedMockResponse>

export type MockStaticValue =
  | Record<string, unknown>
  | unknown[]
  | string
  | number
  | boolean
  | null
  | undefined

export type MockHandlerValue = MockHandler | MockStaticValue | ResolvedMockResponse

export type MockDefinition = Record<string, MockHandlerValue>

export function defineMock<T extends MockDefinition>(mock: T, enable = true) {
  return defineAlovaMock(transformMockDefinition(mock), enable)
}

export function response<T>(
  body: T,
  options: Omit<MockResponse<T>, 'body'> = {},
): T | ResolvedMockResponse | Promise<T | ResolvedMockResponse> {
  const buildResponse = () => ({
    body,
    responseHeaders: {
      'content-type': 'application/json',
      ...(options.headers ?? {}),
    },
    status: options.status ?? 200,
    statusText: options.statusText ?? 'OK',
  })

  if (options.delay && options.delay > 0) {
    return new Promise(resolve => {
      setTimeout(() => resolve(buildResponse()), options.delay)
    })
  }

  return buildResponse()
}

function transformMockDefinition(mock: MockDefinition) {
  return Object.fromEntries(
    Object.entries(mock).map(([key, handler]) => [key, toAlovaMockHandler(key, handler)]),
  )
}

function toAlovaMockHandler(key: string, handler: MockHandlerValue) {
  return (request: MockServerRequest) => {
    if (typeof handler !== 'function') {
      return handler
    }

    return handler({
      data: request.data,
      headers: normalizeHeaders(request.headers),
      method: extractMockMethod(key),
      params: request.params,
      path: extractMockPath(key),
      query: normalizeQuery(request.query),
      url: extractMockPath(key),
    })
  }
}

function normalizeHeaders(headers: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(headers).map(([key, value]) => [key, String(value)]))
}

function normalizeQuery(query: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(query).map(([key, value]) => [
      key,
      Array.isArray(value) ? value.map(item => String(item)) : String(value),
    ]),
  ) as Record<string, string | string[]>
}

function extractMockMethod(key: string): MockMethod {
  const match = key.replace(/^-/, '').match(/^\[(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\]/i)
  return (match?.[1]?.toUpperCase() as MockMethod | undefined) ?? 'GET'
}

function extractMockPath(key: string) {
  return key.replace(/^-/, '').replace(/^\[(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\]/i, '')
}
