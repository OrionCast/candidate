"use server"

import { randomBytes, randomInt } from "node:crypto"
import { z } from "zod"
import { createAdminClient } from "@/lib/supabase/admin"
import {
  DOCUMENT_KINDS,
  DOCUMENT_RULES,
  MIME_EXTENSIONS,
  REF_PATTERN,
  applicantSchema,
  checkFile,
  fileMetaSchema,
  type DocumentKind,
} from "@/lib/validation"

const BUCKET = "documents"

const prepareSchema = z.object({
  applicant: applicantSchema,
  files: z.object({
    identity: fileMetaSchema,
    diploma: fileMetaSchema,
    cv: fileMetaSchema,
    motivation: fileMetaSchema,
  }),
})

const finalizeSchema = z.object({
  ref: z.string().regex(REF_PATTERN),
  applicant: applicantSchema,
  paths: z.object({
    identity: z.string(),
    diploma: z.string(),
    cv: z.string(),
    motivation: z.string(),
  }),
})

export type PrepareResult =
  | {
      ok: true
      ref: string
      uploads: Record<DocumentKind, { path: string; token: string }>
    }
  | { ok: false; error: string }

export type FinalizeResult = { ok: true; reference: string } | { ok: false; error: string }

const firstIssue = (error: z.ZodError) => error.issues[0]?.message ?? "Données invalides."

/** La ville doit exister et être active : le formulaire n'est qu'une commodité, pas une garantie. */
async function isActiveCity(name: string) {
  const { data } = await createAdminClient()
    .from("cities")
    .select("id")
    .eq("name", name)
    .eq("active", true)
    .maybeSingle()
  return Boolean(data)
}

/**
 * Étape 1 : valide le formulaire et délivre des URLs signées.
 * Les fichiers partent ensuite directement du navigateur vers Supabase Storage,
 * sans passer par l'hébergeur (limites de taille des requêtes).
 */
export async function prepareApplication(input: unknown): Promise<PrepareResult> {
  const parsed = prepareSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) }
  const { files } = parsed.data

  if (!(await isActiveCity(parsed.data.applicant.city))) {
    return { ok: false, error: "Veuillez sélectionner une ville dans la liste." }
  }

  for (const kind of DOCUMENT_KINDS) {
    const problem = checkFile(kind, files[kind])
    if (problem) return { ok: false, error: problem }
  }

  const admin = createAdminClient()

  let ref = ""
  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate = `CG-${new Date().getFullYear()}-${randomInt(100000, 1000000)}`
    const { data, error } = await admin.from("candidates").select("id").eq("ref", candidate).maybeSingle()
    if (error) return { ok: false, error: "Service momentanément indisponible." }
    if (!data) {
      ref = candidate
      break
    }
  }
  if (!ref) return { ok: false, error: "Impossible de générer une référence. Réessayez." }

  const uploads = {} as Record<DocumentKind, { path: string; token: string }>
  for (const kind of DOCUMENT_KINDS) {
    const extension = MIME_EXTENSIONS[files[kind].type]
    const path = `${ref}/${kind}-${randomBytes(8).toString("hex")}.${extension}`
    const { data, error } = await admin.storage.from(BUCKET).createSignedUploadUrl(path)
    if (error || !data) return { ok: false, error: "Impossible de préparer l'envoi des fichiers." }
    uploads[kind] = { path, token: data.token }
  }

  return { ok: true, ref, uploads }
}

/** Étape 2 : vérifie que les fichiers sont bien en place, puis enregistre la candidature. */
export async function finalizeApplication(input: unknown): Promise<FinalizeResult> {
  const parsed = finalizeSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) }
  const { ref, applicant, paths } = parsed.data

  if (!(await isActiveCity(applicant.city))) {
    return { ok: false, error: "Veuillez sélectionner une ville dans la liste." }
  }

  const admin = createAdminClient()
  const storage = admin.storage.from(BUCKET)
  const allPaths = DOCUMENT_KINDS.map((kind) => paths[kind])

  const discard = () => storage.remove(allPaths)

  const { data: stored, error: listError } = await storage.list(ref)
  if (listError) return { ok: false, error: "Service momentanément indisponible." }
  const byName = new Map((stored ?? []).map((object) => [object.name, object]))

  for (const kind of DOCUMENT_KINDS) {
    const path = paths[kind]
    const pattern = new RegExp(`^${ref}/${kind}-[a-f0-9]{16}\\.(pdf|jpg|png)$`)
    const object = pattern.test(path) ? byName.get(path.slice(ref.length + 1)) : undefined
    if (!object) {
      await discard()
      return { ok: false, error: `${DOCUMENT_RULES[kind].label} : le fichier n'a pas été reçu.` }
    }
    const metadata = object.metadata as { mimetype?: string; size?: number } | null
    const problem = checkFile(kind, { type: metadata?.mimetype ?? "", size: metadata?.size ?? 0 })
    if (problem) {
      await discard()
      return { ok: false, error: problem }
    }
  }

  const { error } = await admin.from("candidates").insert({
    ref,
    full_name: applicant.fullName,
    email: applicant.email || null,
    phone: applicant.phone,
    city: applicant.city,
    address: applicant.address,
    id_file: paths.identity,
    diploma_file: paths.diploma,
    cv_file: paths.cv,
    motivation_file: paths.motivation,
  })

  if (error) {
    await discard()
    return { ok: false, error: "L'enregistrement a échoué. Veuillez réessayer." }
  }

  return { ok: true, reference: ref }
}
