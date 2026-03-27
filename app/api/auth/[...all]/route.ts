import { getAuth } from '@/backend/infrastructure/auth';
import { toNextJsHandler } from 'better-auth/next-js';

const authHandler = toNextJsHandler(getAuth());

export async function GET(request: Request) {
  return authHandler.GET(request);
}

export async function POST(request: Request) {
  return authHandler.POST(request);
}
