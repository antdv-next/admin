export const useGlobalToken = createGlobalState(() => {
  const token = shallowRef()
  return {
    token,
  }
})
