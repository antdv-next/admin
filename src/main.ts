import { createPinia } from 'pinia'
import { createApp } from 'vue'
import antdPlugins from '@enum-plus/plugin-antd'
import { Enum } from 'enum-plus'
import { setupComponent } from '@/components/setup.ts'
import { setupI18n } from '@/locales'
import App from './App.vue'
import { router } from './router'
import './assets/global.css'

// use antd plugin for enum
Enum.install(antdPlugins)

const main = async () => {
  const app = createApp(App)
  const pinia = createPinia()
  await setupI18n(app)
  app.use(pinia)
  app.use(router)
  await router.isReady()
  setupComponent(app)
  app.mount('#app')
}

main().then(() => {})
