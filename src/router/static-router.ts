import type { RouteRecordRaw } from 'vue-router'
import { useAuthorization } from '@/composables/authorization'
import { forbiddenRoute, notFoundRoute } from '@/router/constant'
import { getDefaultEntryPath } from '@/router/redirect'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'rootRedirect',
    redirect: () => getDefaultEntryPath(Boolean(useAuthorization().value)),
  },
  forbiddenRoute,
  notFoundRoute,
]
