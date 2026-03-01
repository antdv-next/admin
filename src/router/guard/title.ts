import type { Router } from 'vue-router'

export function setupTitleGuard(router: Router) {
  router.afterEach((to) => {
    const title = to.meta?.title
    const suffixTitle = import.meta.env.VITE_APP_TITLE_SUFFIX ?? 'Antdv Next Admin'
    if (title) {
      useTitle(`${title} - ${suffixTitle}`)
    }
    else {
      useTitle(suffixTitle)
    }
  })
}
