export interface LoginParams {
  username: string
  password: string
  [key: string]: any
}

export interface LoginResponse {
  token: string
}

export async function loginApi(params: LoginParams) {
  return usePost<R<LoginResponse>>('/login', params)
}
