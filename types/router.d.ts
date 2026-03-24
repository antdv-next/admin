import type { GeneratedLayoutType } from './layout-generated'
import 'vue-router'

export {}

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    layout?: GeneratedLayoutType | false
    isLayout?: boolean
    // 是否不需要权限控制
    access?: {
      /**
       * 访问模式：
       * - `public` 公开访问，无需任何权限。
       * - `login` 需要登录态，但不需要特定权限。
       * - `menu` 需要在菜单权限列表中。
       * - `inherit` 继承自 `access.from` 指定的路径的访问模式。
       */
      mode?: 'public' | 'login' | 'menu' | 'inherit'
    }
  }
}
