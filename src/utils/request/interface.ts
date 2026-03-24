import type { InternalAxiosRequestConfig } from 'axios'

export interface RequestMeta {
  baseURL?: string
  token?: boolean
  mock?: boolean
}

export interface RequestConfig<T = any> extends InternalAxiosRequestConfig<T> {
  meta?: RequestMeta
}
