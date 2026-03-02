export type LayoutImportMode = 'sync' | 'async'

export interface LayoutPluginOptions {
  defaultLayout?: string
  layoutDirs?: string | string[]
  exclude?: string | string[]
  importMode?: LayoutImportMode
}

export interface ResolvedLayoutPluginOptions {
  defaultLayout: string
  layoutDirs: string[]
  exclude: string[]
  importMode: LayoutImportMode
}
