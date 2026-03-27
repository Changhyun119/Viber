import { expect, type Page } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

import { loadLocalEnv } from "./load-env";

loadLocalEnv();

export const TEST_MEMBER_EMAIL = "playwright-member@local.test";
export const TEST_ADMIN_EMAIL = "playwright-admin@local.test";

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} 환경변수가 필요합니다.`);
  }

  return value;
}

function createSupabaseAdminClient() {
  return createClient(getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL"), getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

function getBaseUrl() {
  return process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3100";
}

export async function loginWithMagicLink(page: Page, email: string, next = "/me/projects") {
  const supabase = createSupabaseAdminClient();
  const baseUrl = getBaseUrl();
  const targetUrl = new URL(next, baseUrl);

  const { data, error } = await supabase.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: {
      redirectTo: `${baseUrl}/auth/callback?next=${encodeURIComponent(next)}`
    }
  });

  if (error || !data.properties.action_link) {
    throw new Error(error?.message ?? "매직링크 생성에 실패했습니다.");
  }

  await page.goto(data.properties.action_link, {
    waitUntil: "networkidle"
  });

  await page.waitForURL((url) => url.pathname === targetUrl.pathname, {
    timeout: 30_000
  });
}

export async function logout(page: Page) {
  await page.getByRole("button", { name: "로그아웃" }).click();
  await expect(page.getByRole("link", { name: "이메일 로그인" })).toBeVisible();
}
