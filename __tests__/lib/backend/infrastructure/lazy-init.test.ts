/**
 * @jest-environment node
 */
import { TextEncoder } from 'node:util';

jest.mock('better-auth', () => ({
  betterAuth: jest.fn(() => ({ api: { getSession: jest.fn() } })),
}));
jest.mock('better-auth/adapters/prisma', () => ({
  prismaAdapter: jest.fn(() => 'mock-db-adapter'),
}));
jest.mock('better-auth/next-js', () => ({
  nextCookies: jest.fn(() => 'mock-next-cookies-plugin'),
}));

const PUBLIC_ENV: Record<string, string> = {
  NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
  NEXT_PUBLIC_GA_MEASUREMENT_ID: 'G-TEST123',
  NEXT_PUBLIC_PRIVACY_POLICY_URL: 'http://localhost/privacy',
};

describe('server infrastructure lazy init', () => {
  let savedEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    savedEnv = { ...process.env };
    global.TextEncoder = TextEncoder;
    jest.resetModules();
  });

  afterEach(() => {
    for (const key of Object.keys(PUBLIC_ENV)) {
      delete process.env[key];
    }
    Object.assign(process.env, savedEnv);
  });

  it('런타임 시크릿 없이도 db/auth 모듈을 import할 수 있다', async () => {
    Object.assign(process.env, PUBLIC_ENV);

    await expect(import('@/backend/infrastructure/db')).resolves.toHaveProperty(
      'getPrisma'
    );
    await expect(
      import('@/backend/infrastructure/auth')
    ).resolves.toHaveProperty('getAuth');
  });
});
