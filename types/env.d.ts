/// <reference types="vite/client" />
/// <reference types="antdv-next/global" />

interface ImportMetaEnv {
  readonly VITE_APP_BASE_API: string
  readonly VITE_APP_TITLE_SUFFIX: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
