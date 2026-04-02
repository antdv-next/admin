import { cloneSysMenuSeeds } from '../admin/system/seeds/menu'
import { defineMock, response } from '../index'

export default defineMock({
  '/user/menus'() {
    return response({
      code: 200,
      msg: 'success',
      data: cloneSysMenuSeeds(),
    })
  },
})
