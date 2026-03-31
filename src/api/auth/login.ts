export interface LoginParams {
  username: string
  password: string
  [key: string]: any
}

export interface LoginResponse {
  token: string
}

export function loginApi(params: LoginParams) {
  return usePost<R<LoginResponse>>('/login', params, {
    meta: {
      token: false,
    },
  })
}
