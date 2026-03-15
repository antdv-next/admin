import { v7 } from 'uuid'
import { defineMock, response } from '../index'

export default defineMock({
  GET() {
    return response({
      code: 200,
      msg: 'Success',
      data: {
        id: v7(),
        username: 'admin',
        nickname: '管理员',
        avatar: '',
      },
    })
  },
})
