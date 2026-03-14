import type { RequestConfig } from './interface'

import { http } from './instance'

export type TryItResult<T, E = unknown>
  = | [error: E, result: undefined]
    | [error: null, result: T]

type TryItFn = (...args: any[]) => any

export function useRequest(config: RequestConfig) {
  return http.request(config)
}

export function useGet<D = any>(url: string, config?: Omit<RequestConfig, 'url' | 'method'>) {
  return http.get(url, config) as Promise<D>
}

export function usePost<D = any, T = any>(url: string, data?: T, config?: Omit<RequestConfig, 'url' | 'method' | 'data'>) {
  return http.post(url, data, config) as Promise<D>
}

export function usePut<D = any, T = any>(url: string, data?: T, config?: Omit<RequestConfig, 'url' | 'method' | 'data'>) {
  return http.put(url, data, config) as Promise<D>
}

export function useDelete<D = any>(url: string, config?: Omit<RequestConfig, 'url' | 'method'>) {
  return http.delete(url, config) as Promise<D>
}

export function usePatch<D = any, T = any>(url: string, data?: T, config?: Omit<RequestConfig, 'url' | 'method' | 'data'>) {
  return http.patch(url, data, config) as Promise<D>
}

async function tryItBase<TFn extends TryItFn>(
  fn: TFn,
  ...args: Parameters<TFn>
): Promise<TryItResult<Awaited<ReturnType<TFn>>>> {
  try {
    return [null, await fn(...args)]
  }
  catch (error) {
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
    }
    catch (error) {
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
      return [null, await fn(...args) as TResult]
    }
    catch (error) {
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
  result<TResult, TError = unknown>(): <TFn extends TryItFn>(
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
function tryIt<TError, TFn extends TryItFn>(
  fn?: TFn,
  ...args: Parameters<TFn>
) {
  if (typeof fn === 'function') {
    return tryItBase(fn, ...args)
  }

  return createTryItWithError<TError>()
}

const tryItHandler = tryIt as TryIt
tryItHandler.result = createTryItWithResult

export { tryItHandler as tryIt }
