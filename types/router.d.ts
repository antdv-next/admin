import type { GeneratedLayoutType } from './layout-generated'
import 'vue-router'

export {}

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    layout?: GeneratedLayoutType | false
    isLayout?: boolean
  }
}
