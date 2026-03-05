import { defineEventHandler } from 'nitro/h3'
import { HttpException } from '../../common/exception/HttpException'

export default defineEventHandler(() => {
  throw new HttpException(400, 'Bad Request')
})
