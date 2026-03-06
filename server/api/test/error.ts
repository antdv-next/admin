import { defineHandler } from 'nitro/h3'
import { HttpException } from '../../common/exception/HttpException'

export default defineHandler(() => {
  throw new HttpException(400, 'Bad Request')
})
