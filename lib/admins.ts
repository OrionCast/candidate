import "server-only"
import { createAdminClient } from "@/lib/supabase/admin"

export type AdminAccount = { id: string; email: string; createdAt: string }

/** Comptes ayant le rôle administrateur (lu dans app_metadata). */
export async function listAdmins(): Promise<AdminAccount[]> {
  const { data, error } = await createAdminClient().auth.admin.listUsers({ perPage: 200 })
  if (error) return []
  return data.users
    .filter((user) => user.app_metadata?.role === "admin")
    .map((user) => ({ id: user.id, email: user.email ?? "(sans e-mail)", createdAt: user.created_at }))
    .sort((a, b) => a.email.localeCompare(b.email))
}
