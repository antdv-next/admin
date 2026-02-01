import type { Router } from 'vue-router'

export function setupTitleGuard(router: Router) {
  router.afterEach((to) => {
    const title = to.meta?.title
    if (title) {
      useTitle(title)
    }
  })
}
