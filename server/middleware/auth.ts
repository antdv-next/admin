import { defineMiddleware } from 'nitro/h3';

export default defineMiddleware(async (event) => {
  const uri = new URL(event.req.url);
  console.log('url', uri.pathname);
});
