import type { App } from 'vue'
import Access from './access/access.vue'
import AntdIcon from './icons/antd.vue'
import PageContainer from './page-container/index.vue'

export const setupComponent = (app: App) => {
  app.component('Access', Access)
  app.component('AntdIcon', AntdIcon)
  app.component('PageContainer', PageContainer)
}
