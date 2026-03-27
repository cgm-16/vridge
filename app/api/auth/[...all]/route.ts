import { getAuth } from '@/backend/infrastructure/auth';
import { toNextJsHandler } from 'better-auth/next-js';

let authHandler: ReturnType<typeof toNextJsHandler> | undefined;

function getHandler() {
  authHandler ??= toNextJsHandler(getAuth());
  return authHandler;
}

export async function GET(request: Request) {
  return getHandler().GET(request);
}

export async function POST(request: Request) {
  return getHandler().POST(request);
}
