import type { AxiosInstance } from 'axios'
import type { RequestConfig } from '../interface'
import { AUTHORIZATION_KEY } from '../constant'

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
