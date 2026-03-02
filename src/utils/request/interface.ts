import type { InternalAxiosRequestConfig } from 'axios'

export interface ResponseBody<T = any> {
  code: number
  data?: T
  msg: string
}

export interface RequestMeta {
  baseURL?: string
  token?: boolean
}

export interface RequestConfig<T = any> extends InternalAxiosRequestConfig<T> {
  meta?: RequestMeta
}
