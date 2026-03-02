import type { LayoutType } from 'virtual:layout'

import 'vue-router'

export {}

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    layout?: LayoutType | false
    isLayout?: boolean
  }
}
