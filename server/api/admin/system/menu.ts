import { defineHandler } from 'nitro/h3'

export default defineHandler(() => {
  return {
    code: 200,
    msg: 'success',
    data: {
      total: 100,
      list: [],
    },
  }
})
