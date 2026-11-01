"use server"

import { randomBytes } from "node:crypto"
import { refresh, updateTag } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { requireAdmin } from "@/lib/auth"
import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import {
  DOCUMENT_KINDS,
  MAX_FILE_SIZE,
  cityNameSchema,
  RESULTS_FILE_PATTERN,
  type DocumentKind,
} from "@/lib/validation"

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/admin/login")
}

export type DocumentUrls = Record<DocumentKind, string | null>

/** URLs signées (5 min) des 4 documents d'un candidat, pour l'aperçu admin. */
export async function getCandidateDocuments(
  candidateId: string
): Promise<{ ok: true; urls: DocumentUrls } | { ok: false; error: string }> {
  await requireAdmin()
  if (!z.uuid().safeParse(candidateId).success) return { ok: false, error: "Candidat invalide." }

  const supabase = await createClient()
  const { data: row } = await supabase
    .from("candidates")
    .select("id_file, diploma_file, cv_file, motivation_file")
    .eq("id", candidateId)
    .maybeSingle()
  if (!row) return { ok: false, error: "Dossier introuvable." }

  const files: Record<DocumentKind, string> = {
    identity: row.id_file,
    diploma: row.diploma_file,
    cv: row.cv_file,
    motivation: row.motivation_file,
  }

  const urls = {} as DocumentUrls
  for (const kind of DOCUMENT_KINDS) {
    const { data } = await supabase.storage.from("documents").createSignedUrl(files[kind], 300)
    urls[kind] = data?.signedUrl ?? null
  }
  return { ok: true, urls }
}

const resultsFileSchema = z.object({
  type: z.literal("application/pdf", "Le document doit être un PDF."),
  size: z.number().int().positive().max(MAX_FILE_SIZE, "Le PDF dépasse 5 Mo."),
})

export async function prepareResultsUpload(
  input: unknown
): Promise<{ ok: true; path: string; token: string } | { ok: false; error: string }> {
  await requireAdmin()
  const parsed = resultsFileSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Fichier invalide." }

  const path = `${randomBytes(12).toString("hex")}.pdf`
  const { data, error } = await createAdminClient().storage.from("results").createSignedUploadUrl(path)
  if (error || !data) return { ok: false, error: "Impossible de préparer l'envoi du PDF." }
  return { ok: true, path, token: data.token }
}

const publishSchema = z.object({
  content: z.string().trim().max(10000),
  pdfPath: z.string().regex(RESULTS_FILE_PATTERN).nullable(),
})

export async function publishResults(
  input: unknown
): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireAdmin()
  const parsed = publishSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "Données invalides." }
  const { content, pdfPath } = parsed.data

  const supabase = await createClient()
  const { data: current } = await supabase.from("publication").select("pdf_file").eq("id", 1).maybeSingle()
  const oldFile = current?.pdf_file ?? null

  const storage = createAdminClient().storage.from("results")
  if (pdfPath) {
    const { data: found } = await storage.list("", { search: pdfPath })
    if (!found?.some((object) => object.name === pdfPath)) {
      return { ok: false, error: "Le PDF n'a pas été reçu. Réessayez." }
    }
  }

  const { error } = await supabase
    .from("publication")
    .update({ content, pdf_file: pdfPath ?? oldFile, updated_at: new Date().toISOString() })
    .eq("id", 1)
  if (error) return { ok: false, error: "La publication a échoué." }

  if (pdfPath && oldFile && oldFile !== pdfPath) await storage.remove([oldFile])

  updateTag("publication")
  return { ok: true }
}

type CityResult = { ok: true } | { ok: false; error: string }

const failure = (error: { code?: string } | null, fallback: string): CityResult => ({
  ok: false,
  error: error?.code === "23505" ? "Cette ville existe déjà." : fallback,
})

function cityChanged(): CityResult {
  updateTag("cities")
  refresh()
  return { ok: true }
}

export async function addCity(input: unknown): Promise<CityResult> {
  await requireAdmin()
  const name = cityNameSchema.safeParse(input)
  if (!name.success) return { ok: false, error: name.error.issues[0]?.message ?? "Nom invalide." }

  const supabase = await createClient()
  const { error } = await supabase.from("cities").insert({ name: name.data })
  return error ? failure(error, "L'ajout de la ville a échoué.") : cityChanged()
}

/** Renomme une ville. Les candidatures déjà déposées gardent l'ancien nom. */
export async function renameCity(id: unknown, input: unknown): Promise<CityResult> {
  await requireAdmin()
  const cityId = z.uuid().safeParse(id)
  const name = cityNameSchema.safeParse(input)
  if (!cityId.success) return { ok: false, error: "Ville invalide." }
  if (!name.success) return { ok: false, error: name.error.issues[0]?.message ?? "Nom invalide." }

  const supabase = await createClient()
  const { error } = await supabase.from("cities").update({ name: name.data }).eq("id", cityId.data)
  return error ? failure(error, "Le renommage a échoué.") : cityChanged()
}

/** Active ou désactive une ville (on ne supprime pas : l'historique reste cohérent). */
export async function setCityActive(id: unknown, active: unknown): Promise<CityResult> {
  await requireAdmin()
  const cityId = z.uuid().safeParse(id)
  if (!cityId.success || typeof active !== "boolean") return { ok: false, error: "Requête invalide." }

  const supabase = await createClient()
  const { error } = await supabase.from("cities").update({ active }).eq("id", cityId.data)
  return error ? failure(error, "La modification a échoué.") : cityChanged()
}
