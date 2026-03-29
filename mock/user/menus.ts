import { defineMock, response } from '../index'

export default defineMock({
  GET() {
    return response({
      code: 200,
      msg: 'success',
      data: [
        {
          id: '1',
          path: '/admin/workspace',
          menuStatus: 0,
          title: '工作台',
        },
        {
          id: '2',
          parentId: '1',
          path: '/admin/workspace/overview',
          menuStatus: 0,
          title: '概览',
        },
        {
          id: '3',
          parentId: '1',
          path: '/admin/workspace/dashboard',
          menuStatus: 0,
          title: '控制台',
        },
      ],
    })
  },
})
