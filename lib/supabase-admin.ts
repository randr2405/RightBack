// Server-only Supabase client. NEVER import this from a "use client" file —
// it uses the service_role key, which bypasses RLS and must never reach
// the browser. Only import this inside API routes / server actions.

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);