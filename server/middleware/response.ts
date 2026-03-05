import { defineMiddleware, HTTPResponse } from 'nitro/h3'
import { HttpException } from '../common/exception/HttpException'

export default defineMiddleware(async (event, next) => {
  try {
    const data = await next()
    if (data && data instanceof HTTPResponse) {
      return data
    }

    return {
      code: 200,
      data,
      message: 'success',
    }
  }
  catch (e) {
    if (e instanceof HttpException) {
      return {
        code: e.code,
        message: e.message,
      }
    }
  }
})
