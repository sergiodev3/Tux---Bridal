import "server-only";
import { createClient } from "@supabase/supabase-js";

import { getServerEnv } from "@/lib/env";

/**
 * Service-role client for trusted server-only mutations (e.g. `claim_coupon` RPC).
 * Never import this module from Client Components.
 */
export function createSupabaseServiceClient() {
  const env = getServerEnv();
  return createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}
