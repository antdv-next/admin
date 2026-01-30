import vue from '@vitejs/plugin-vue'
import unocss from 'unocss/vite'
import { defineConfig } from 'vite'
import dayjs from 'vite-plugin-dayjs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    unocss(),
    dayjs(),
  ],
})
