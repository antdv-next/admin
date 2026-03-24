declare global {
  interface ResponseBody<T = any> {
    code: number
    data?: T
    msg: string
  }

  interface ErrorResponse {
    code: number
    msg: string
  }

  type R<T = any> = ResponseBody<T>

  type ER = ErrorResponse
}

export {}
