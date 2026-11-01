import { createBrowserClient } from "@supabase/ssr"

/** Client navigateur : utilisé uniquement pour envoyer les fichiers via URL signée. */
export function createBrowserSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
