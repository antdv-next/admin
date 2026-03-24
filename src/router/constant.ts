import type { RouteRecordRaw } from 'vue-router';

export const ROUTE_NAME = 'ROUTE_NAME';

export const NOT_FOUND_NAME = 'ROOT_Not_Found';

export const notFoundRoute: RouteRecordRaw = {
  path: '/:pathMatch(.*)*',
  name: NOT_FOUND_NAME,
  component: () => import('@/pages/error/not-found.vue'),
};
