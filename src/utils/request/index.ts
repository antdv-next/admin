import type { Method, RequestBody } from 'alova'
import { createRequestClient, http, RequestError } from './alova'
import type { RequestConfig } from './interface'

export type TryItResult<T, E = unknown> = [error: E, result: undefined] | [error: null, result: T]

type TryItFn = (...args: any[]) => any

export function useRequest<D = any>(config: RequestConfig & { url: string }): Method<any> {
  return http.Request<D>(config)
}

export function useGet<D = any>(url: string, config?: Omit<RequestConfig, 'url' | 'method'>) {
  return http.Get<D>(url, config)
}

export function usePost<D = any, T extends RequestBody = RequestBody>(
  url: string,
  data?: T,
  config?: Omit<RequestConfig, 'url' | 'method' | 'data'>,
) {
  return http.Post<D>(url, data, config)
}

export function usePut<D = any, T extends RequestBody = RequestBody>(
  url: string,
  data?: T,
  config?: Omit<RequestConfig, 'url' | 'method' | 'data'>,
) {
  return http.Put<D>(url, data, config)
}

export function useDelete<D = any>(url: string, config?: Omit<RequestConfig, 'url' | 'method'>) {
  return http.Delete<D>(url, undefined, config)
}

export function usePatch<D = any, T extends RequestBody = RequestBody>(
  url: string,
  data?: T,
  config?: Omit<RequestConfig, 'url' | 'method' | 'data'>,
) {
  return http.Patch<D>(url, data, config)
}

async function tryItBase<TFn extends TryItFn>(
  fn: TFn,
  ...args: Parameters<TFn>
): Promise<TryItResult<Awaited<ReturnType<TFn>>>> {
  try {
    return [null, await fn(...args)]
  } catch (error) {
    return [error, undefined]
  }
}

function createTryItWithError<TError>() {
  return async <TFn extends TryItFn>(
    fn: TFn,
    ...args: Parameters<TFn>
  ): Promise<TryItResult<Awaited<ReturnType<TFn>>, TError>> => {
    try {
      return [null, await fn(...args)]
    } catch (error) {
      return [error as TError, undefined]
    }
  }
}

function createTryItWithResult<TResult, TError = unknown>() {
  return async <TFn extends TryItFn>(
    fn: TFn,
    ...args: Parameters<TFn>
  ): Promise<TryItResult<TResult, TError>> => {
    try {
      return [null, (await fn(...args)) as TResult]
    } catch (error) {
      return [error as TError, undefined]
    }
  }
}

interface TryIt {
  <TFn extends TryItFn>(
    fn: TFn,
    ...args: Parameters<TFn>
  ): Promise<TryItResult<Awaited<ReturnType<TFn>>>>
  <TError>(): <TFn extends TryItFn>(
    fn: TFn,
    ...args: Parameters<TFn>
  ) => Promise<TryItResult<Awaited<ReturnType<TFn>>, TError>>
  result: <TResult, TError = unknown>() => <TFn extends TryItFn>(
    fn: TFn,
    ...args: Parameters<TFn>
  ) => Promise<TryItResult<TResult, TError>>
}

function tryIt<TFn extends TryItFn>(
  fn: TFn,
  ...args: Parameters<TFn>
): Promise<TryItResult<Awaited<ReturnType<TFn>>>>
function tryIt<TError>(): <TFn extends TryItFn>(
  fn: TFn,
  ...args: Parameters<TFn>
) => Promise<TryItResult<Awaited<ReturnType<TFn>>, TError>>
function tryIt<TError, TFn extends TryItFn>(fn?: TFn, ...args: Parameters<TFn>) {
  if (typeof fn === 'function') {
    return tryItBase(fn, ...args)
  }

  return createTryItWithError<TError>()
}

const tryItHandler = tryIt as TryIt
tryItHandler.result = createTryItWithResult

export { tryItHandler as tryIt }
export { createRequestClient, http, RequestError }
export type { RequestConfig, RequestMeta } from './interface'
