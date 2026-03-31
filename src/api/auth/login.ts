import { http } from '@/utils/request'

export interface LoginParams {
  username: string
  password: string
  [key: string]: any
}

export interface LoginResponse {
  token: string
}

export function loginMethod(params: LoginParams) {
  return http.Post<R<LoginResponse>>('/login', params, {
    meta: {
      token: false,
    },
  })
}
