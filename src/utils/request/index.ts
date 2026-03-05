import type { RequestConfig } from './interface'

import { http } from './instance'

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
