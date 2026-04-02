import type { App } from 'vue'
import Access from './access/access.vue'
import AntdIcon from './icons/antd.vue'
import PageContainer from './page-container/index.vue'
import SearchFormGrid from './search-form-grid/index.vue'
import SearchFormGridItem from './search-form-grid/item.vue'

export const setupComponent = (app: App) => {
  app.component('Access', Access)
  app.component('AntdIcon', AntdIcon)
  app.component('PageContainer', PageContainer)
  app.component('SearchFormGrid', SearchFormGrid)
  app.component('SearchFormGridItem', SearchFormGridItem)
}
