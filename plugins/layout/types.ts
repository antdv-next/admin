export type LayoutImportMode = 'sync' | 'async'

export interface LayoutPluginOptions {
  defaultLayout?: string
  /**
   * When an app route (e.g. /admin/**) has no app-level default layout
   * (e.g. admin/default), whether to fallback to global defaultLayout.
   */
  fallbackToGlobalDefault?: boolean
  layoutDirs?: string | string[]
  exclude?: string | string[]
  importMode?: LayoutImportMode
}

export interface ResolvedLayoutPluginOptions {
  defaultLayout: string
  fallbackToGlobalDefault: boolean
  layoutDirs: string[]
  exclude: string[]
  importMode: LayoutImportMode
}
