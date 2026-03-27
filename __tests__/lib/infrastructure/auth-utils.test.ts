jest.mock('@/backend/infrastructure/auth', () => ({
  getAuth: (() => {
    const auth = {
      api: { getSession: jest.fn() },
    };
    return jest.fn(() => auth);
  })(),
}));
jest.mock('@/backend/infrastructure/db', () => ({
  getPrisma: (() => {
    const prisma = {
      appUser: { findUnique: jest.fn() },
    };
    return jest.fn(() => prisma);
  })(),
}));
jest.mock('next/headers', () => ({
  headers: jest.fn().mockResolvedValue(new Headers()),
}));

import { getAuth } from '@/backend/infrastructure/auth';
import { getPrisma } from '@/backend/infrastructure/db';
import {
  getCurrentUser,
  requireUser,
  requireRole,
} from '@/backend/infrastructure/auth-utils';

const mockGetSession = getAuth().api.getSession as unknown as jest.Mock;
const mockFindUnique = getPrisma().appUser.findUnique as unknown as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('getCurrentUser', () => {
  it('세션 없으면 null 반환', async () => {
    mockGetSession.mockResolvedValue(null);
    expect(await getCurrentUser()).toBeNull();
  });

  it('세션 있지만 appUser 없으면 null 반환', async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'u1', email: 'a@b.com' } });
    mockFindUnique.mockResolvedValue(null);
    expect(await getCurrentUser()).toBeNull();
  });

  it('세션 + appUser 있으면 유저 컨텍스트 반환', async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'u1', email: 'a@b.com' } });
    mockFindUnique.mockResolvedValue({ role: 'candidate', orgId: null });
    const user = await getCurrentUser();
    expect(user).toEqual({
      userId: 'u1',
      email: 'a@b.com',
      role: 'candidate',
      orgId: null,
    });
  });
});

describe('requireUser', () => {
  it('인증된 유저 반환', async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'u1', email: 'a@b.com' } });
    mockFindUnique.mockResolvedValue({ role: 'candidate', orgId: null });
    await expect(requireUser()).resolves.toMatchObject({ userId: 'u1' });
  });

  it('미인증 시 throw', async () => {
    mockGetSession.mockResolvedValue(null);
    await expect(requireUser()).rejects.toThrow();
  });
});

describe('requireRole', () => {
  it('올바른 역할이면 유저 반환', async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'u1', email: 'a@b.com' } });
    mockFindUnique.mockResolvedValue({ role: 'recruiter', orgId: 'org1' });
    await expect(requireRole('recruiter', 'admin')).resolves.toMatchObject({
      role: 'recruiter',
    });
  });

  it('잘못된 역할이면 throw', async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'u1', email: 'a@b.com' } });
    mockFindUnique.mockResolvedValue({ role: 'candidate', orgId: null });
    await expect(requireRole('recruiter', 'admin')).rejects.toThrow();
  });
});
