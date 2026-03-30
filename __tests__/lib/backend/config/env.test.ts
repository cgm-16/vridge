// 중요: jest.mock 호출은 모든 import보다 먼저 와야 합니다
// 이 파일에는 모의(mock)가 필요 없습니다

import type { Env, PublicEnv } from '@/backend/config/env';

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

  it('모든 변수가 있으면 getEnv가 전체 env 객체를 반환한다', async () => {
    Object.assign(process.env, VALID_ENV);
    const { getEnv } = (await import('@/backend/config/env')) as {
      getEnv: () => Env;
    };
    const env = getEnv();
    expect(env.DATABASE_URL).toBe(VALID_ENV.DATABASE_URL);
  });

  it('공개 변수만 있으면 getPublicEnv가 공개 env 객체를 반환한다', async () => {
    Object.assign(process.env, {
      NEXT_PUBLIC_APP_URL: VALID_ENV.NEXT_PUBLIC_APP_URL,
    });
    const { getPublicEnv } = (await import('@/backend/config/env')) as {
      getPublicEnv: () => PublicEnv;
    };
    const env = getPublicEnv();
    expect(env.NEXT_PUBLIC_APP_URL).toBe(VALID_ENV.NEXT_PUBLIC_APP_URL);
  });

  it('DATABASE_URL 누락 시 throw한다', async () => {
    Object.assign(process.env, VALID_ENV);
    delete process.env.DATABASE_URL;
    const { getEnv } = (await import('@/backend/config/env')) as {
      getEnv: () => Env;
    };
    expect(() => getEnv()).toThrow(/DATABASE_URL/);
  });

  it('BETTER_AUTH_SECRET 누락 시 throw한다', async () => {
    Object.assign(process.env, VALID_ENV);
    delete process.env.BETTER_AUTH_SECRET;
    const { getEnv } = (await import('@/backend/config/env')) as {
      getEnv: () => Env;
    };
    expect(() => getEnv()).toThrow(/BETTER_AUTH_SECRET/);
  });

  it('NEXT_PUBLIC_APP_URL이 URL 형식이 아니면 throw한다', async () => {
    Object.assign(process.env, VALID_ENV);
    process.env.NEXT_PUBLIC_APP_URL = 'not-a-url';
    const { getPublicEnv } = (await import('@/backend/config/env')) as {
      getPublicEnv: () => PublicEnv;
    };
    expect(() => getPublicEnv()).toThrow(/NEXT_PUBLIC_APP_URL/);
  });

  it('에러 메시지에 시크릿 값이 포함되지 않는다', async () => {
    Object.assign(process.env, VALID_ENV);
    process.env.BETTER_AUTH_SECRET = 'my-super-secret-value';
    delete process.env.DATABASE_URL; // 에러를 강제 발생시키기 위해 삭제
    const { getEnv } = (await import('@/backend/config/env')) as {
      getEnv: () => Env;
    };
    let errorMessage = '';
    try {
      getEnv();
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
    const { getEnv } = (await import('@/backend/config/env')) as {
      getEnv: () => Env;
    };
    let errorMessage = '';
    try {
      getEnv();
    } catch (e) {
      errorMessage = (e as Error).message;
    }
    expect(errorMessage).toContain(
      '필수 환경 변수가 없거나 형식이 올바르지 않습니다'
    );
    expect(errorMessage).toContain('DATABASE_URL');
    expect(errorMessage).toContain('BETTER_AUTH_SECRET');
  });

  it('GOOGLE_CLIENT_ID만 있고 GOOGLE_CLIENT_SECRET 없으면 throw한다', async () => {
    Object.assign(process.env, VALID_ENV);
    delete process.env.GOOGLE_CLIENT_SECRET;
    const { getEnv } = (await import('@/backend/config/env')) as {
      getEnv: () => Env;
    };
    expect(() => getEnv()).toThrow(/GOOGLE_CLIENT_ID/);
  });

  it('FACEBOOK_CLIENT_SECRET만 있고 FACEBOOK_CLIENT_ID 없으면 throw한다', async () => {
    Object.assign(process.env, VALID_ENV);
    delete process.env.FACEBOOK_CLIENT_ID;
    const { getEnv } = (await import('@/backend/config/env')) as {
      getEnv: () => Env;
    };
    expect(() => getEnv()).toThrow(/FACEBOOK_CLIENT/);
  });
});
