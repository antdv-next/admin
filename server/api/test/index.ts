import { defineEventHandler } from 'nitro/h3'

export default defineEventHandler(() => {
  return { hello: 'API' }
})
