import { headers } from 'next/headers';
import { getAuth } from '@/backend/infrastructure/auth';
import { getPrisma } from '@/backend/infrastructure/db';
import { AppRole } from '@/backend/generated/prisma/enums';

export type UserContext = {
  userId: string;
  email: string;
  role: AppRole;
  orgId: string | null;
};

export async function getCurrentUser(): Promise<UserContext | null> {
  const session = await getAuth().api.getSession({ headers: await headers() });
  if (!session) return null;

  const appUser = await getPrisma().appUser.findUnique({
    where: { id: session.user.id },
    select: { role: true, orgId: true },
  });
  if (!appUser) return null;

  return {
    userId: session.user.id,
    email: session.user.email,
    role: appUser.role,
    orgId: appUser.orgId,
  };
}

export async function requireUser(): Promise<UserContext> {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');
  return user;
}

export async function requireRole(...roles: AppRole[]): Promise<UserContext> {
  const user = await requireUser();
  if (!roles.includes(user.role)) throw new Error('Forbidden');
  return user;
}
