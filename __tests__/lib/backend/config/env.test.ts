// 중요: jest.mock 호출은 모든 import보다 먼저 와야 합니다
// 이 파일에는 모의(mock)가 필요 없습니다

import type { Env } from '@/backend/config/env';

const VALID_ENV: Record<string, string> = {
  DATABASE_URL: 'postgresql://localhost/db',
  DIRECT_URL: 'postgresql://localhost/db',
  BETTER_AUTH_SECRET: 'secret',
  BETTER_AUTH_URL: 'http://localhost:3000',
  GOOGLE_CLIENT_ID: 'gid',
  GOOGLE_CLIENT_SECRET: 'gsecret',
  FACEBOOK_CLIENT_ID: 'fid',
  FACEBOOK_CLIENT_SECRET: 'fsecret',
  NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
  NEXT_PUBLIC_GA_MEASUREMENT_ID: 'G-TEST123',
  NEXT_PUBLIC_PRIVACY_POLICY_URL: 'http://localhost/privacy',
};

describe('env 설정', () => {
  let savedEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    savedEnv = { ...process.env };
    jest.resetModules();
  });

  afterEach(() => {
    for (const key of Object.keys(VALID_ENV)) {
      delete process.env[key];
    }
    Object.assign(process.env, savedEnv);
  });

  it('모든 변수가 있으면 env 객체를 내보낸다', async () => {
    Object.assign(process.env, VALID_ENV);
    const { env } = (await import('@/backend/config/env')) as { env: Env };
    expect(env.DATABASE_URL).toBe(VALID_ENV.DATABASE_URL);
    expect(env.NEXT_PUBLIC_GA_MEASUREMENT_ID).toBe('G-TEST123');
  });

  it('DATABASE_URL 누락 시 throw한다', async () => {
    Object.assign(process.env, VALID_ENV);
    delete process.env.DATABASE_URL;
    await expect(import('@/backend/config/env')).rejects.toThrow(
      /DATABASE_URL/
    );
  });

  it('BETTER_AUTH_SECRET 누락 시 throw한다', async () => {
    Object.assign(process.env, VALID_ENV);
    delete process.env.BETTER_AUTH_SECRET;
    await expect(import('@/backend/config/env')).rejects.toThrow(
      /BETTER_AUTH_SECRET/
    );
  });

  it('NEXT_PUBLIC_APP_URL이 URL 형식이 아니면 throw한다', async () => {
    Object.assign(process.env, VALID_ENV);
    process.env.NEXT_PUBLIC_APP_URL = 'not-a-url';
    await expect(import('@/backend/config/env')).rejects.toThrow(
      /NEXT_PUBLIC_APP_URL/
    );
  });

  it('에러 메시지에 시크릿 값이 포함되지 않는다', async () => {
    Object.assign(process.env, VALID_ENV);
    process.env.BETTER_AUTH_SECRET = 'my-super-secret-value';
    delete process.env.DATABASE_URL; // 에러를 강제 발생시키기 위해 삭제
    let errorMessage = '';
    try {
      await import('@/backend/config/env');
    } catch (e) {
      errorMessage = (e as Error).message;
    }
    expect(errorMessage).not.toContain('my-super-secret-value');
    expect(errorMessage.length).toBeGreaterThan(0);
  });

  it('여러 변수 누락 시 모두 에러 메시지에 포함된다', async () => {
    Object.assign(process.env, VALID_ENV);
    delete process.env.DATABASE_URL;
    delete process.env.BETTER_AUTH_SECRET;
    let errorMessage = '';
    try {
      await import('@/backend/config/env');
    } catch (e) {
      errorMessage = (e as Error).message;
    }
    expect(errorMessage).toContain('DATABASE_URL');
    expect(errorMessage).toContain('BETTER_AUTH_SECRET');
  });

  it('GOOGLE_CLIENT_ID만 있고 GOOGLE_CLIENT_SECRET 없으면 throw한다', async () => {
    Object.assign(process.env, VALID_ENV);
    delete process.env.GOOGLE_CLIENT_SECRET;
    await expect(import('@/backend/config/env')).rejects.toThrow(
      /GOOGLE_CLIENT_ID/
    );
  });

  it('FACEBOOK_CLIENT_SECRET만 있고 FACEBOOK_CLIENT_ID 없으면 throw한다', async () => {
    Object.assign(process.env, VALID_ENV);
    delete process.env.FACEBOOK_CLIENT_ID;
    await expect(import('@/backend/config/env')).rejects.toThrow(
      /FACEBOOK_CLIENT/
    );
  });
});
