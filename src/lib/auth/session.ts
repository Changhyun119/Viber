import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import type { User as SupabaseUser } from "@supabase/supabase-js";

import { db } from "@/db";
import { profiles } from "@/db/schema";
import { adminBootstrapEmails, env } from "@/lib/env";
import { buildRedirectPath } from "@/lib/http";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/shared";
import { ensureAbsoluteUrl } from "@/lib/utils/urls";

export const LEGACY_SESSION_COOKIE_NAME = "vibe_session";

export type SessionProfile = typeof profiles.$inferSelect;

function getProfileDefaults(user: SupabaseUser) {
  const email = user.email?.toLowerCase() ?? null;
  const githubUsername = typeof user.user_metadata?.user_name === "string" ? user.user_metadata.user_name : null;
  const displayName =
    (typeof user.user_metadata?.full_name === "string" && user.user_metadata.full_name.trim()) ||
    (typeof user.user_metadata?.name === "string" && user.user_metadata.name.trim()) ||
    (typeof user.user_metadata?.preferred_username === "string" && user.user_metadata.preferred_username.trim()) ||
    githubUsername ||
    email?.split("@")[0] ||
    "member";
  const role = email && adminBootstrapEmails.includes(email) ? "admin" : "member";

  return {
    email,
    displayName,
    githubUsername,
    role
  };
}

export async function ensureProfileForSupabaseUser(user: SupabaseUser) {
  const defaults = getProfileDefaults(user);
  const existingById = await db.query.profiles.findFirst({
    where: eq(profiles.id, user.id)
  });

  if (existingById) {
    const nextRole = existingById.role === "admin" || defaults.role === "admin" ? "admin" : "member";

    if (
      existingById.email !== defaults.email ||
      existingById.displayName !== defaults.displayName ||
      existingById.githubUsername !== defaults.githubUsername ||
      existingById.role !== nextRole
    ) {
      await db
        .update(profiles)
        .set({
          email: defaults.email ?? existingById.email,
          displayName: defaults.displayName,
          githubUsername: defaults.githubUsername,
          role: nextRole,
          updatedAt: new Date()
        })
        .where(eq(profiles.id, user.id));
    }

    return (
      (await db.query.profiles.findFirst({
        where: eq(profiles.id, user.id)
      })) ?? existingById
    );
  }

  if (defaults.email) {
    const existingByEmail = await db.query.profiles.findFirst({
      where: eq(profiles.email, defaults.email)
    });

    if (existingByEmail) {
      throw new Error("같은 이메일을 사용하는 기존 로컬 계정이 있어 Supabase 계정과 자동 연결할 수 없습니다.");
    }
  }

  const [created] = await db
    .insert(profiles)
    .values({
      id: user.id,
      email: defaults.email ?? `${user.id}@supabase.local`,
      displayName: defaults.displayName,
      githubUsername: defaults.githubUsername,
      role: defaults.role
    })
    .returning();

  return created;
}

export function buildSignInPath(nextPath = "/me/projects", error?: string) {
  return buildRedirectPath("/auth/sign-in", {
    next: ensureAbsoluteUrl(nextPath),
    error
  });
}

export async function getCurrentProfile() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  return ensureProfileForSupabaseUser(data.user);
}

export async function requireCurrentProfile(nextPath = "/me/projects") {
  const user = await getCurrentProfile();

  if (!user) {
    redirect(buildSignInPath(nextPath));
  }

  return user;
}

export async function requireAdminProfile(nextPath = "/admin/moderation") {
  const user = await getCurrentProfile();

  if (!user) {
    redirect(buildSignInPath(nextPath));
  }

  if (user.role !== "admin") {
    redirect(
      buildRedirectPath("/", {
        error: "운영 권한이 필요한 페이지입니다."
      })
    );
  }

  return user;
}

export async function getSupabaseLoginState() {
  if (!isSupabaseConfigured()) {
    return {
      configured: false,
      appUrl: env.NEXT_PUBLIC_APP_URL
    };
  }

  return {
    configured: true,
    appUrl: env.NEXT_PUBLIC_APP_URL
  };
}
