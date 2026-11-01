"use server"

import { redirect } from "next/navigation"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"

export type LoginState = { error?: string }

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
})

export async function login(_previous: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })
  if (!parsed.success) return { error: "Renseignez une adresse e-mail et un mot de passe valides." }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data)
  if (error || !data.user) return { error: "Identifiant ou mot de passe incorrect." }

  if (data.user.app_metadata?.role !== "admin") {
    await supabase.auth.signOut()
    return { error: "Ce compte n'a pas les droits d'administration." }
  }

  redirect("/admin")
}
