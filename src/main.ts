import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { setupComponent } from '@/components/setup.ts'
import App from './App.vue'
import { router } from './router'
import './assets/global.css'

const main = async () => {
  const app = createApp(App)
  const pinia = createPinia()
  app.use(pinia)
  app.use(router)
  await router.isReady()
  setupComponent(app)
  app.mount('#app')
}

main().then(() => {})
