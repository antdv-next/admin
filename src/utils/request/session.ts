import { useApp } from '@/composables/app'
import { LOGIN_PATH } from '@/constants/router'
import { useUserStore } from '@/stores/user'

let sessionExpiredHandling = false

/**
 * 会话失效统一处理：清空登录态并跳转登录页，携带当前地址用于登录后回跳。
 * 并发的 401 响应只会触发一次登出与提示。
 */
export async function handleSessionExpired() {
  if (sessionExpiredHandling) {
    return
  }
  sessionExpiredHandling = true

  try {
    const userStore = useUserStore()
    userStore.logout()
    useApp().message.error('登录已过期，请重新登录')

    // 动态引入路由，避免请求层与路由层的循环依赖
    const { router } = await import('@/router')
    const currentRoute = router.currentRoute.value
    if (currentRoute.path === LOGIN_PATH) {
      return
    }
    await router.replace({
      path: LOGIN_PATH,
      query: currentRoute.fullPath === '/' ? {} : { redirect: currentRoute.fullPath },
    })
  } finally {
    sessionExpiredHandling = false
  }
}
