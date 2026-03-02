import type { RouteRecordRaw } from 'vue-router'
import { notFoundRoute } from '@/router/constant'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/index.vue'),
  },
  notFoundRoute,
]
