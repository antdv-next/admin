import type { RequestBody } from 'alova'
import type { FetchRequestInit } from 'alova/fetch'

export interface RequestMeta {
  baseURL?: string
  token?: boolean
  mock?: boolean
}

export interface RequestConfig<T extends RequestBody = RequestBody> extends FetchRequestInit {
  data?: T
  method?: string
  params?: Record<string, unknown> | string
  meta?: RequestMeta
}
