import { PrismaClient } from '@/backend/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { getEnv } from '@/backend/config/env';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

let prismaClient: PrismaClient | undefined;

function createPrismaClient() {
  const adapter = new PrismaPg({
    connectionString: getEnv().DATABASE_URL,
  });

  return new PrismaClient({ adapter });
}

export function getPrisma(): PrismaClient {
  if (process.env.NODE_ENV === 'production') {
    prismaClient ??= createPrismaClient();
    return prismaClient;
  }

  globalForPrisma.prisma ??= createPrismaClient();
  return globalForPrisma.prisma;
}
