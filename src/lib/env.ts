import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_ENABLE_DEV_AUTH: z.string().optional().default("true"),
  DEV_ADMIN_EMAIL: z.string().email().optional().default("admin@local.test"),
  DEV_MEMBER_EMAIL: z.string().email().optional().default("member@local.test")
});

const parsed = envSchema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_ENABLE_DEV_AUTH: process.env.NEXT_PUBLIC_ENABLE_DEV_AUTH,
  DEV_ADMIN_EMAIL: process.env.DEV_ADMIN_EMAIL,
  DEV_MEMBER_EMAIL: process.env.DEV_MEMBER_EMAIL
});

if (!parsed.success) {
  throw new Error(`환경변수가 올바르지 않습니다: ${parsed.error.message}`);
}

export const env = parsed.data;
