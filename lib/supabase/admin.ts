import "server-only"
import { createClient } from "@supabase/supabase-js"

/**
 * Client à clé service_role : contourne la RLS.
 * Réservé au serveur, et à n'utiliser qu'après avoir validé la requête.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
}
