import type { ColProps } from 'antdv-next'
import type { ComputedRef, InjectionKey } from 'vue'

export interface SearchFormGridContext {
  itemColProps: ComputedRef<ColProps>
  isCollapsed: ComputedRef<boolean>
  visibleCount: ComputedRef<number>
  registerItem: () => number
}

export const searchFormGridKey = Symbol('search-form-grid') as InjectionKey<SearchFormGridContext>
