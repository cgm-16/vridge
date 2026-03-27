import 'server-only';
import { z } from 'zod';

const publicEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().min(1),
  NEXT_PUBLIC_PRIVACY_POLICY_URL: z.string().url(),
});

const envSchema = publicEnvSchema
  .extend({
    DATABASE_URL: z.string().url(),
    DIRECT_URL: z.string().url(),
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.string().url(),
    GOOGLE_CLIENT_ID: z.string().min(1).optional(),
    GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),
    FACEBOOK_CLIENT_ID: z.string().min(1).optional(),
    FACEBOOK_CLIENT_SECRET: z.string().min(1).optional(),
  })
  .superRefine((data, ctx) => {
    if (!!data.GOOGLE_CLIENT_ID !== !!data.GOOGLE_CLIENT_SECRET) {
      ctx.addIssue({
        code: 'custom',
        message:
          'GOOGLE_CLIENT_ID와 GOOGLE_CLIENT_SECRET은 함께 제공되어야 합니다',
        path: ['GOOGLE_CLIENT_ID'],
      });
    }
    if (!!data.FACEBOOK_CLIENT_ID !== !!data.FACEBOOK_CLIENT_SECRET) {
      ctx.addIssue({
        code: 'custom',
        message:
          'FACEBOOK_CLIENT_ID와 FACEBOOK_CLIENT_SECRET은 함께 제공되어야 합니다',
        path: ['FACEBOOK_CLIENT_ID'],
      });
    }
  });

export type Env = z.infer<typeof envSchema>;
export type PublicEnv = z.infer<typeof publicEnvSchema>;

function parseEnv<T>(schema: z.ZodType<T>): T {
  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    const missing = parsed.error.issues.map((i) => i.path.join('.'));
    throw new Error(
      `필수 환경 변수가 없거나 형식이 올바르지 않습니다: ${missing.join(', ')}`
    );
  }
  return parsed.data;
}

let cachedPublicEnv: PublicEnv | undefined;
let cachedEnv: Env | undefined;

export function getPublicEnv(): PublicEnv {
  cachedPublicEnv ??= parseEnv(publicEnvSchema);
  return cachedPublicEnv;
}

export function getEnv(): Env {
  cachedEnv ??= parseEnv(envSchema);
  return cachedEnv;
}
