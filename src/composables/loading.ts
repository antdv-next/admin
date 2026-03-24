import { createTrickling } from 'trickling'

export const useLoading = createGlobalState(() => {
  const id = '#loading-app'
  const remove = () => {
    const el = document.querySelector(id)
    if (el) {
      el.remove()
    }
  }
  const trickling = createTrickling({
    trickleSpeed: 200,
    trickle: true,
  })
  return {
    remove,
    trickling,
  }
})
