import "server-only"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export type AdminUser = { id: string; email: string | null }

/** Retourne l'administrateur connecté, ou null. Le rôle vient de app_metadata (non modifiable par l'utilisateur). */
export async function getAdmin(): Promise<AdminUser | null> {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const claims = data?.claims
  if (!claims || claims.app_metadata?.role !== "admin") return null
  return { id: claims.sub, email: typeof claims.email === "string" ? claims.email : null }
}

/** À appeler au début de chaque page et Server Action admin : le proxy ne suffit pas. */
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdmin()
  if (!admin) redirect("/admin/login")
  return admin
}
