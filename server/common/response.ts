export interface ResponseBody<T = unknown> {
  code: number
  data?: T
  msg: string
}

export function createResponseBody<T>(
  code: number,
  msg: string,
  data?: T,
): ResponseBody<T> {
  return {
    code,
    data,
    msg,
  }
}

export function createJsonResponse<T>(
  body: ResponseBody<T>,
  init: ResponseInit = {},
) {
  const headers = new Headers(init.headers)
  if (!headers.has('content-type')) {
    headers.set('content-type', 'application/json; charset=utf-8')
  }

  return new Response(JSON.stringify(body), {
    ...init,
    headers,
  })
}
