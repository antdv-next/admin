import { defineMiddleware, HTTPResponse } from 'nitro/h3'
import { createResponseBody } from '../common/response'

export default defineMiddleware(async (_, next) => {
  const data = await next()
  if (data instanceof HTTPResponse || data instanceof Response) {
    return data
  }

  return createResponseBody(200, 'success', data)
})
