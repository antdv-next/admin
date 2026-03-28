import { fileURLToPath } from 'node:url'
import { defineConfig } from 'drizzle-kit'
import { loadEnv } from 'vite-plus'

const baseUrl = fileURLToPath(new URL('.', import.meta.url))

const env = loadEnv(process.env.NODE_ENV ?? 'development', baseUrl, ['DRIZZLE_'])
export default defineConfig({
  dialect: 'postgresql',
  schema: './server/db/schema/*',
  out: './server/db/migrations',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
})
