import { useAuthorization } from '@/composables/authorization'

export interface UserState {
  token: string | null
}

const authorization = useAuthorization()

export const useUserStore = defineStore(
  'user',
  {
    state: (): UserState => ({
      token: authorization.value,
    }),
    actions: {

    },
    getters: {

    },
  },
)
