import type { GlobalToken } from 'antdv-next'

export const useGlobalToken = createGlobalState(() => {
  const token = shallowRef<GlobalToken>()
  return {
    token,
  }
})
