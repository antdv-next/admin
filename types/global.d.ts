declare global {
  interface ResponseBody<T = any> {
    code: number
    data?: T
    msg: string
  }

  type R<T = any> = ResponseBody<T>
}

export {}
