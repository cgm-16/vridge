import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { getPrisma } from '@/backend/infrastructure/db';
import { getEnv, type Env } from '@/backend/config/env';

function getSocialProviders(env: Env) {
  return {
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
}

type Auth = ReturnType<typeof betterAuth>;

let authInstance: Auth | undefined;

export function getAuth(): Auth {
  if (authInstance) {
    return authInstance;
  }

  const env = getEnv();
  const prisma = getPrisma();
  const socialProviders = getSocialProviders(env);

  authInstance = betterAuth({
    database: prismaAdapter(prisma, { provider: 'postgresql' }),
    advanced: {
      database: {
        generateId: 'uuid',
      },
    },
    emailAndPassword: { enabled: true },
    ...(Object.keys(socialProviders).length > 0 ? { socialProviders } : {}),
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
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
              try {
                await prisma.user.delete({ where: { id: user.id } });
              } catch (deleteError) {
                console.error('보상 삭제 실패:', deleteError);
              }
              throw error;
            }
          },
        },
      },
    },
  });

  return authInstance;
}
