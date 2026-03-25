/// <reference types="vite-plus/client" />
/// <reference types="antdv-next/global" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<Record<string, never>, Record<string, never>, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_APP_BASE_API: string
  readonly VITE_APP_MOCK_ENABLED: string
  readonly VITE_APP_TITLE_SUFFIX: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
