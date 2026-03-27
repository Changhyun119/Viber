import { createClient } from "@supabase/supabase-js";

import { env } from "@/lib/env";
import { getSupabaseUrl } from "@/lib/supabase/shared";

export function isSupabaseAdminConfigured() {
  return Boolean(env.SUPABASE_SERVICE_ROLE_KEY && env.NEXT_PUBLIC_SUPABASE_URL);
}

export function createSupabaseAdminClient() {
  if (!env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase service role key가 설정되지 않았습니다.");
  }

  return createClient(getSupabaseUrl(), env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });
}
