import type { AxiosError, AxiosInstance, AxiosResponse } from 'axios'

export function setupResponseGuard(http: AxiosInstance) {
  const handleResponse = (response: AxiosResponse) => {
    // 判断一下返回数据的类型，如果是json的话，才返回response.data，否则直接返回response
    const contentType = response.headers['Content-Type'] || response.headers['content-type']
    if (contentType?.includes('application/json')) {
      return response.data
    }
    return response
  }

  const handleError = (error: AxiosError) => {
    const data = error.response?.data as ER
    const { message } = useApp()
    if (data && data.msg) {
      message.error(data.msg)
    } else {
      message.error(error.message ?? 'Server Error')
    }
    return Promise.reject(error)
  }
  http.interceptors.response.use(handleResponse, handleError)
}
