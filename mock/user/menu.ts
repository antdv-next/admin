import { defineMock, response } from '../index'

export default defineMock({
  GET() {
    return response({
      code: 200,
      msg: 'Success',
      data: [],
    })
  },
})
