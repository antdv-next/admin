import { defineConfig } from 'nitro/config';

export default defineConfig({
  errorHandler: './server/error.ts',
  serverDir: './server',
});
