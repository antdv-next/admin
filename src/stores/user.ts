import type { UserInfo } from '@/api/user'

import { getUserInfoApi } from '@/api/user'
import { useAuthorization } from '@/composables/authorization'

export interface UserState {
  token: string | null
  userInfo?: UserInfo
  userInfoLoading: boolean
}

const authorization = useAuthorization()
let userInfoPromise: Promise<UserInfo | undefined> | null = null

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: authorization.value,
    userInfo: undefined,
    userInfoLoading: false,
  }),
  actions: {
    setToken(token: string | null) {
      const isChanged = this.token !== token
      this.token = token
      authorization.value = token
      if (!token || isChanged) {
        this.userInfo = undefined
      }
      if (!token) {
        this.userInfoLoading = false
        userInfoPromise = null
      }
    },
    setUserInfo(userInfo?: UserInfo) {
      this.userInfo = userInfo
    },
    async fetchUserInfo() {
      const currentToken = this.token
      if (!currentToken) {
        return undefined
      }
      if (userInfoPromise) {
        return userInfoPromise
      }

      this.userInfoLoading = true
      userInfoPromise = (async () => {
        const [error, res] = await tryIt<ER>()(getUserInfoApi)
        if (this.token !== currentToken) {
          return this.userInfo
        }
        if (error || !res?.data) {
          this.userInfo = undefined
          return undefined
        }

        this.userInfo = res.data
        return this.userInfo
      })()

      try {
        return await userInfoPromise
      } finally {
        if (this.token === currentToken) {
          this.userInfoLoading = false
        }
        userInfoPromise = null
      }
    },
    async ensureUserInfo() {
      if (this.userInfo || !this.token) {
        return this.userInfo
      }

      return this.fetchUserInfo()
    },
    logout() {
      this.setToken(null)
      this.userInfo = undefined
      this.userInfoLoading = false
      userInfoPromise = null
    },
  },
  getters: {},
})
