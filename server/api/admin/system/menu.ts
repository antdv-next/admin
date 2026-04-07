import { defineMock, response } from '../../../../mock'

export default defineMock({
  '[POST]/admin/system/menu': () => {
    return response({
      status: 200,
      data: {
        total: 100,
        list: [],
      },
      msg: 'success',
    })
  },
})
