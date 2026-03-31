import 'alova'

declare module 'alova' {
  export interface AlovaCustomTypes {
    meta: {
      baseURL?: string
      token?: boolean
      mock?: boolean
    }
  }
}

export {}
