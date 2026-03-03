import type { UserInfo } from '@/api/user'
import { useAuthorization } from '@/composables/authorization'

export interface UserState {
  token: string | null
  userInfo?: UserInfo
}

const authorization = useAuthorization()

export const useUserStore = defineStore(
  'user',
  {
    state: (): UserState => ({
      token: authorization.value,
      userInfo: undefined,
    }),
    actions: {

    },
    getters: {

    },
  },
)
