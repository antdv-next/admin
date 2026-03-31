import { defineMock, response } from '..'

export default defineMock({
  '/test'() {
    return response(
      {
        code: 200,
        data: {
          id: 'mock-id',
        },
      },
      { delay: 300 },
    )
  },

  '[POST]/test'() {
    return response(
      {
        code: 200,
        data: {
          id: 'mock-id',
        },
      },
      { delay: 500 },
    )
  },
  '[PUT]/test'() {
    return response(
      {
        code: 200,
        data: {
          id: 'mock-id',
        },
      },
      { delay: 500 },
    )
  },

  '[DELETE]/test'() {
    return response(
      {
        code: 200,
        data: {
          id: 'mock-id',
        },
      },
      { delay: 1000 },
    )
  },
})
