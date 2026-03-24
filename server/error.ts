import type { HTTPEvent } from 'nitro/h3';

import { defineErrorHandler } from 'nitro';

import { HttpException } from './common/exception';
import { createJsonResponse, createResponseBody } from './common/response';

function resolveHttpException(error: unknown): HttpException | null {
  if (error instanceof HttpException) {
    return error;
  }

  if (typeof error === 'object' && error !== null) {
    const cause = Reflect.get(error, 'cause');
    if (cause) {
      return resolveHttpException(cause);
    }
  }

  return null;
}

function isApiRequest(event: HTTPEvent) {
  const pathname = new URL(event.req.url).pathname;
  return pathname === '/api' || pathname.startsWith('/api/');
}

export default defineErrorHandler((error, event) => {
  if (!isApiRequest(event)) {
    return;
  }

  const customError = resolveHttpException(error);
  const statusCode = customError?.code ?? 500;
  const message = customError?.message ?? 'Internal Server Error';

  console.error(error);

  return createJsonResponse(createResponseBody(statusCode, message), { status: statusCode });
});
