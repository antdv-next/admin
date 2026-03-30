import type { MenuInfo } from '@/api/menu'
import type { UserInfo } from '@/api/user'
import { getUserInfoApi, getUserMenuApi } from '@/api/user'
import { useAuthorization } from '@/composables/authorization'
import { extractMenuPermissions } from '@/utils/permission'

export interface UserState {
  token: string | null
  userInfo?: UserInfo
  userInfoLoading: boolean
  menus: MenuInfo[]
  permissions: string[]
  menusLoading: boolean
  menusLoaded: boolean
}

const authorization = useAuthorization()
let userInfoPromise: Promise<UserInfo | undefined> | null = null
let menusPromise: Promise<MenuInfo[] | undefined> | null = null

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: authorization.value,
    userInfo: undefined,
    userInfoLoading: false,
    menus: [],
    permissions: [],
    menusLoading: false,
    menusLoaded: false,
  }),
  actions: {
    setToken(token: string | null) {
      const isChanged = this.token !== token
      this.token = token
      authorization.value = token
      if (!token || isChanged) {
        this.userInfo = undefined
        this.menus = []
        this.permissions = []
        this.menusLoaded = false
      }
      if (!token || isChanged) {
        this.userInfoLoading = false
        this.menusLoading = false
        userInfoPromise = null
        menusPromise = null
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
    async fetchMenus() {
      const currentToken = this.token
      if (!currentToken) {
        return undefined
      }
      if (menusPromise) {
        return menusPromise
      }

      this.menusLoading = true
      menusPromise = (async () => {
        const [error, res] = await tryIt<ER>()(getUserMenuApi)
        if (this.token !== currentToken) {
          return this.menus
        }
        if (error || !res?.data) {
          this.menus = []
          this.permissions = []
          this.menusLoaded = false
          return undefined
        }

        this.menus = res.data
        this.permissions = extractMenuPermissions(this.menus)
        this.menusLoaded = true
        return this.menus
      })()

      try {
        return await menusPromise
      } finally {
        if (this.token === currentToken) {
          this.menusLoading = false
        }
        menusPromise = null
      }
    },
    async ensureMenus() {
      if (!this.token) {
        return undefined
      }
      if (this.menusLoaded) {
        return this.menus
      }

      return this.fetchMenus()
    },
    async ensureAuthContext() {
      const [userInfo, menus] = await Promise.all([this.ensureUserInfo(), this.ensureMenus()])
      return {
        userInfo,
        menus,
        permissions: this.permissions,
      }
    },
    logout() {
      this.setToken(null)
      this.userInfo = undefined
      this.userInfoLoading = false
      this.menus = []
      this.permissions = []
      this.menusLoading = false
      this.menusLoaded = false
      userInfoPromise = null
      menusPromise = null
    },
  },
  getters: {},
})
