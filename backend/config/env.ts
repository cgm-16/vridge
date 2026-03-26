import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  DIRECT_URL: z.string().min(1),
  BETTER_AUTH_SECRET: z.string().min(1),
  BETTER_AUTH_URL: z.string().url(),
  GOOGLE_CLIENT_ID: z.string().min(1).optional(),
  GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),
  FACEBOOK_CLIENT_ID: z.string().min(1).optional(),
  FACEBOOK_CLIENT_SECRET: z.string().min(1).optional(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().min(1),
  NEXT_PUBLIC_PRIVACY_POLICY_URL: z.string().url(),
});

export type Env = z.infer<typeof envSchema>;

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const missing = parsed.error.issues.map((i) => i.path.join('.'));
  throw new Error(
    `Missing or invalid environment variables: ${missing.join(', ')}`
  );
}

export const env: Env = parsed.data;
