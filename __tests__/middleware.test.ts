/**
 * @jest-environment node
 */
jest.mock('@/lib/infrastructure/auth', () => ({
  auth: { api: { getSession: jest.fn() } },
}));

import { NextRequest } from 'next/server';
import { middleware } from '@/middleware';
import { auth } from '@/lib/infrastructure/auth';

const mockGetSession = auth.api.getSession as unknown as jest.Mock;

function makeRequest(path: string) {
  return new NextRequest(new URL(path, 'http://localhost:3000'));
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('공개 라우트', () => {
  it('/ 은 세션 확인 없이 통과', async () => {
    const res = await middleware(makeRequest('/'));
    expect(mockGetSession).not.toHaveBeenCalled();
    expect(res?.status).not.toBe(307);
  });

  it('/jobs/* 은 세션 확인 없이 통과', async () => {
    await middleware(makeRequest('/jobs/123'));
    expect(mockGetSession).not.toHaveBeenCalled();
  });

  it('/announcement/* 은 세션 확인 없이 통과', async () => {
    await middleware(makeRequest('/announcement/1'));
    expect(mockGetSession).not.toHaveBeenCalled();
  });

  it('/api/auth/* 은 세션 확인 없이 통과', async () => {
    await middleware(makeRequest('/api/auth/sign-in'));
    expect(mockGetSession).not.toHaveBeenCalled();
  });
});

describe('보호 라우트', () => {
  it('미인증 시 /jobs로 리다이렉트', async () => {
    mockGetSession.mockResolvedValue(null);
    const res = await middleware(makeRequest('/dashboard/candidate/profile'));
    expect(res?.status).toBe(307);
    expect(res?.headers.get('location')).toContain('/jobs');
  });

  it('인증 시 통과', async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'u1' } });
    const res = await middleware(makeRequest('/dashboard/candidate/profile'));
    expect(res?.status).not.toBe(307);
  });
});
