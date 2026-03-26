import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { prisma } from '@/backend/infrastructure/db';
import { env } from '@/backend/config/env';

const socialProviders = {
  ...(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
    ? {
        google: {
          clientId: env.GOOGLE_CLIENT_ID,
          clientSecret: env.GOOGLE_CLIENT_SECRET,
        },
      }
    : {}),
  ...(env.FACEBOOK_CLIENT_ID && env.FACEBOOK_CLIENT_SECRET
    ? {
        facebook: {
          clientId: env.FACEBOOK_CLIENT_ID,
          clientSecret: env.FACEBOOK_CLIENT_SECRET,
        },
      }
    : {}),
};

const baseURL = env.BETTER_AUTH_URL;

const secret = env.BETTER_AUTH_SECRET;

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  advanced: {
    database: {
      generateId: 'uuid',
    },
  },
  emailAndPassword: { enabled: true },
  ...(Object.keys(socialProviders).length > 0 ? { socialProviders } : {}),
  secret,
  baseURL,
  plugins: [nextCookies()],
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          try {
            await prisma.$transaction(async (tx) => {
              await tx.appUser.create({ data: { id: user.id } });
              await tx.profilesPublic.create({ data: { userId: user.id } });
              await tx.profilesPrivate.create({ data: { userId: user.id } });
            });
          } catch (error) {
            console.error('사용자 프로비저닝 실패:', error);
          }
        },
      },
    },
  },
});
