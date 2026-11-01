import "server-only"
import { createClient } from "@/lib/supabase/server"

export type CandidateRow = {
  id: string
  ref: string
  full_name: string
  email: string | null
  phone: string
  city: string
  address: string
  created_at: string
}

const PAGE = 1000

/** Lit toutes les candidatures (PostgREST plafonne à 1000 lignes par requête). */
export async function fetchAllCandidates(): Promise<CandidateRow[]> {
  const supabase = await createClient()
  const rows: CandidateRow[] = []

  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from("candidates")
      .select("id, ref, full_name, email, phone, city, address, created_at")
      .order("created_at", { ascending: false })
      .range(from, from + PAGE - 1)
    if (error) throw new Error("Lecture des candidatures impossible.")
    rows.push(...data)
    if (data.length < PAGE) return rows
  }
}
