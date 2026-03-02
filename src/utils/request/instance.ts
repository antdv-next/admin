import axios from 'axios'
import { setupRequestGuard } from './guard/request'
import { setupResponseGuard } from './guard/response'

export const http = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API || '/api',
  timeout: 6000,
})

setupRequestGuard(http)
setupResponseGuard(http)
