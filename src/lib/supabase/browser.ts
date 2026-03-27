"use client";

import { createBrowserClient } from "@supabase/ssr";

let client: ReturnType<typeof createBrowserClient> | null = null;

function getBrowserSupabaseUrl() {
  const value = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!value) {
    throw new Error("Supabase URL이 설정되지 않았습니다.");
  }

  return value;
}

function getBrowserSupabasePublishableKey() {
  const value = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!value) {
    throw new Error("Supabase publishable key가 설정되지 않았습니다.");
  }

  return value;
}

export function createSupabaseBrowserClient() {
  if (client) {
    return client;
  }

  client = createBrowserClient(getBrowserSupabaseUrl(), getBrowserSupabasePublishableKey());
  return client;
}
