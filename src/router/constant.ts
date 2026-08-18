import type { RouteRecordRaw } from 'vue-router'
import { FORBIDDEN_PATH } from '@/constants/router'

export const ROUTE_NAME = 'ROUTE_NAME'

export const NOT_FOUND_NAME = 'ROOT_Not_Found'

export const FORBIDDEN_NAME = 'ROOT_Forbidden'

export const notFoundRoute: RouteRecordRaw = {
  path: '/:pathMatch(.*)*',
  name: NOT_FOUND_NAME,
  component: () => import('@/pages/error/not-found.vue'),
  meta: {
    layout: false,
    title: '404',
  },
}

export const forbiddenRoute: RouteRecordRaw = {
  path: FORBIDDEN_PATH,
  name: FORBIDDEN_NAME,
  component: () => import('@/pages/error/forbidden.vue'),
  meta: {
    access: {
      mode: 'public',
    },
    layout: false,
    title: '403',
  },
}
