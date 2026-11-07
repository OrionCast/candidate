import "server-only"
import type { CandidateStatus } from "@/lib/candidate-status"
import { createClient } from "@/lib/supabase/server"

export type CandidateRow = {
  id: string
  ref: string
  full_name: string
  email: string | null
  phone: string
  city: string
  address: string
  date_of_birth: string | null
  place_of_birth: string | null
  bac_type: string | null
  bac_year: number | null
  specialty: string | null
  photo_file: string | null
  status: CandidateStatus
  /** URL signée de la photo (valable 1 h), pour les vignettes du tableau. */
  photo_url: string | null
  created_at: string
}

const PAGE = 1000
const SIGN_CHUNK = 100
const PHOTO_URL_TTL = 60 * 60

/** Lit toutes les candidatures (PostgREST plafonne à 1000 lignes par requête). */
export async function fetchAllCandidates(): Promise<CandidateRow[]> {
  const supabase = await createClient()
  const rows: Omit<CandidateRow, "photo_url">[] = []

  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from("candidates")
      .select(
        "id, ref, full_name, email, phone, city, address, date_of_birth, place_of_birth, bac_type, bac_year, specialty, photo_file, status, created_at"
      )
      .order("created_at", { ascending: false })
      .range(from, from + PAGE - 1)
    if (error) throw new Error("Lecture des candidatures impossible.")
    rows.push(...data)
    if (data.length < PAGE) break
  }

  // Une seule requête de signature par lot de photos plutôt qu'une par candidat.
  const urlByPath = new Map<string, string>()
  const paths = rows.map((row) => row.photo_file).filter((path): path is string => Boolean(path))
  for (let i = 0; i < paths.length; i += SIGN_CHUNK) {
    const { data } = await supabase.storage
      .from("documents")
      .createSignedUrls(paths.slice(i, i + SIGN_CHUNK), PHOTO_URL_TTL)
    data?.forEach((item) => {
      if (item.path && item.signedUrl) urlByPath.set(item.path, item.signedUrl)
    })
  }

  return rows.map((row) => ({
    ...row,
    photo_url: row.photo_file ? (urlByPath.get(row.photo_file) ?? null) : null,
  }))
}
