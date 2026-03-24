import type { RouteRecordRaw } from 'vue-router'

import { notFoundRoute } from '@/router/constant'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'rootRedirect',
    redirect: '/home',
  },
  notFoundRoute,
]
