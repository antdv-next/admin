import { defineMock, response } from '..'

export default defineMock({
  GET() {
    return response({
      code: 200,
      data: {
        id: 'mock-id',
      },
    }, { delay: 300 })
  },

  POST() {
    return response({
      code: 200,
      data: {
        id: 'mock-id',
      },
    }, { delay: 500 })
  },
  PUT() {
    return response({
      code: 200,
      data: {
        id: 'mock-id',
      },
    }, { delay: 500 })
  },

  DELETE() {
    return response({
      code: 200,
      data: {
        id: 'mock-id',
      },
    }, { delay: 1000 })
  },
})
