import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import Access from './components/access/access.vue'
import AntdIcon from './components/icons/antd.vue'
import { router } from './router'
import './assets/global.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.component('Access', Access)
app.component('AntdIcon', AntdIcon)
app.mount('#app')
