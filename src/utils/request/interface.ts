import type {
  AlovaCustomTypes,
  AlovaDefaultCacheAdapter,
  AlovaGenerics,
  AlovaMethodCommonConfig,
  AlovaMethodCreateConfig,
  MethodType,
  RequestBody,
  StatesExport,
} from 'alova'
import type { FetchRequestInit } from 'alova/fetch'

type FetchMethodGenerics = AlovaGenerics<
  unknown,
  unknown,
  FetchRequestInit,
  Response,
  Headers,
  AlovaDefaultCacheAdapter,
  AlovaDefaultCacheAdapter,
  StatesExport<any>
>

export type RequestMeta = AlovaCustomTypes['meta']
export type RequestMethodConfig<
  Responded = unknown,
  Transformed = unknown,
> = AlovaMethodCreateConfig<FetchMethodGenerics, Responded, Transformed>

export interface RequestConfig<
  T extends RequestBody = RequestBody,
  Responded = unknown,
  Transformed = unknown,
> extends Omit<AlovaMethodCommonConfig<FetchMethodGenerics, Responded, Transformed>, 'data'> {
  data?: T
  method?: MethodType
  params?: Record<string, unknown> | string
  meta?: RequestMeta
}
