import type { InternalAxiosRequestConfig, RawAxiosResponseHeaders } from 'axios'

export const MOCK_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'] as const

export type MockMethod = (typeof MOCK_METHODS)[number]

export interface MockContext<T = unknown> {
  config: InternalAxiosRequestConfig<T>
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
  headers?: RawAxiosResponseHeaders
  status?: number
  statusText?: string
}

export interface ResolvedMockResponse<T = unknown> extends MockResponse<T> {
  __mockResponse: true
}

export type MockHandler<T = unknown, Body = unknown> = (
  context: MockContext<Body>,
) => T | ResolvedMockResponse<T> | Promise<T | ResolvedMockResponse<T>>

export type MockStaticValue =
  | Record<string, unknown>
  | unknown[]
  | string
  | number
  | boolean
  | null
  | undefined

export type MockHandlerValue = MockHandler | MockStaticValue | ResolvedMockResponse

export type MockDefinition = Partial<Record<MockMethod | Lowercase<MockMethod>, MockHandlerValue>>

export function defineMock<T extends MockDefinition>(mock: T) {
  return mock
}

export function response<T>(
  body: T,
  options: Omit<MockResponse<T>, 'body'> = {},
): ResolvedMockResponse<T> {
  return {
    __mockResponse: true,
    body,
    ...options,
  }
}
