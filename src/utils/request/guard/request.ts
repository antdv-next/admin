import type { AxiosInstance } from 'axios'
import { AUTHORIZATION_KEY } from '../constant'
import type { RequestConfig } from '../interface'

export function setupRequestGuard(http: AxiosInstance) {
  const handleRequest = (config: RequestConfig) => {
    const userStore = useUserStore()
    if (config.meta?.token !== false) {
      config.headers.set(AUTHORIZATION_KEY, `Bearer ${userStore.token}`)
    }
    return config
  }
  http.interceptors.request.use(handleRequest)
}
