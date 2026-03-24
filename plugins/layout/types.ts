import type { ResolvedLayoutSource } from './sources';

export type LayoutImportMode = 'sync' | 'async';
export type LayoutFallback = string | false;

export interface ModuleLayoutOptions {
  /**
   * Override the module name used in layout keys.
   * Example: route prefix "foo" can match layout key "admin/default".
   */
  module?: string;
  /**
   * Explicit default layout key for this route prefix.
   */
  layout?: string;
  /**
   * Fallback layout when module default layout is missing.
   */
  fallbackLayout?: LayoutFallback;
}

export interface LayoutPluginOptions {
  defaultLayout?: string;
  /**
   * @deprecated Use globalFallbackLayout instead.
   */
  fallbackToGlobalDefault?: boolean;
  /**
   * Fallback layout for module routes when module default layout is missing.
   * Set false to disable fallback.
   */
  globalFallbackLayout?: LayoutFallback;
  /**
   * Route-prefix based module config.
   * Key: route prefix (e.g. "admin"), value: module layout behavior.
   */
  modules?: Record<string, ModuleLayoutOptions>;
  layoutDirs?: string | string[];
  exclude?: string | string[];
  importMode?: LayoutImportMode;
}

export interface ResolvedLayoutPluginOptions {
  defaultLayout: string;
  globalFallbackLayout: LayoutFallback;
  modules: Record<string, ModuleLayoutOptions>;
  layoutDirs: string[];
  layoutSources: ResolvedLayoutSource[];
  exclude: string[];
  importMode: LayoutImportMode;
}
