import { defineMock, response } from '../index.ts'

export default defineMock({
  GET() {
    return response({
      code: 200,
      msg: 'success',
      data: [
        {
          id: 'btn-1',
          permission: 'system:user:create',
        },
        {
          id: 'btn-2',
          permission: 'system:user:update',
        },
        {
          id: 'btn-3',
          code: 'system:user:remove',
        },
      ],
    })
  },
})
