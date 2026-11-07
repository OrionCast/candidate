"use server"

import { randomBytes } from "node:crypto"
import { refresh, updateTag } from "next/cache"
import { z } from "zod"
import { requireAdmin } from "@/lib/auth"
import { isCandidateStatus } from "@/lib/candidate-status"
import {
  GALLERY_BUCKET,
  GALLERY_CATEGORY_IDS,
  GALLERY_MAX_SIZE,
  GALLERY_MIMES,
  GALLERY_SIZES,
} from "@/lib/gallery"
import { NEWS_CATEGORIES, NEWS_TONES } from "@/lib/news"
import { fromBrazzavilleDate } from "@/lib/site-settings"
import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { specialtyNameSchema } from "@/lib/validation"

type Result = { ok: true } | { ok: false; error: string }

const fail = (error: string) => ({ ok: false as const, error })
const firstIssue = (error: z.ZodError) => error.issues[0]?.message ?? "Données invalides."

/** Invalide le cache public concerné et rafraîchit l'écran de l'administrateur. */
function changed(tag: string): Result {
  updateTag(tag)
  refresh()
  return { ok: true }
}

const dbFailure = (error: { code?: string } | null, fallback: string, duplicate?: string) =>
  fail(error?.code === "23505" && duplicate ? duplicate : fallback)

// ───────────── Réglages du site ─────────────

const dateField = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date invalide.").or(z.literal(""))

const settingsSchema = z
  .object({
    opensOn: dateField,
    closesOn: dateField,
    enforceWindow: z.boolean(),
    placesCount: z.number().int("Le nombre de places doit être un entier.").min(1, "Le nombre de places doit être positif.").max(100000),
    phonePrimary: z.string().trim().max(40),
    phoneSecondary: z.string().trim().max(40),
    contactEmail: z.email("Adresse e-mail de contact invalide.").max(180),
    address: z.string().trim().min(1, "L'adresse est obligatoire.").max(255),
  })
  .refine((v) => !v.opensOn || !v.closesOn || v.closesOn >= v.opensOn, {
    message: "La date de fin doit être postérieure à la date de début.",
  })

export async function updateSettings(input: unknown): Promise<Result> {
  await requireAdmin()
  const parsed = settingsSchema.safeParse(input)
  if (!parsed.success) return fail(firstIssue(parsed.error))
  const v = parsed.data

  const supabase = await createClient()
  const { error } = await supabase
    .from("site_settings")
    .update({
      apply_opens_at: v.opensOn ? fromBrazzavilleDate(v.opensOn, false) : null,
      apply_closes_at: v.closesOn ? fromBrazzavilleDate(v.closesOn, true) : null,
      enforce_window: v.enforceWindow,
      places_count: v.placesCount,
      phone_primary: v.phonePrimary,
      phone_secondary: v.phoneSecondary,
      contact_email: v.contactEmail,
      address: v.address,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1)
  return error ? fail("L'enregistrement des réglages a échoué.") : changed("settings")
}

// ───────────── Spécialités ─────────────

export async function addSpecialty(input: unknown): Promise<Result> {
  await requireAdmin()
  const name = specialtyNameSchema.safeParse(input)
  if (!name.success) return fail(firstIssue(name.error))

  const supabase = await createClient()
  const { error } = await supabase.from("specialties").insert({ name: name.data })
  return error ? dbFailure(error, "L'ajout a échoué.", "Cette spécialité existe déjà.") : changed("specialties")
}

/** Renomme une spécialité. Les candidatures déjà déposées gardent l'ancien nom. */
export async function renameSpecialty(id: unknown, input: unknown): Promise<Result> {
  await requireAdmin()
  const specialtyId = z.uuid().safeParse(id)
  const name = specialtyNameSchema.safeParse(input)
  if (!specialtyId.success) return fail("Spécialité invalide.")
  if (!name.success) return fail(firstIssue(name.error))

  const supabase = await createClient()
  const { error } = await supabase.from("specialties").update({ name: name.data }).eq("id", specialtyId.data)
  return error ? dbFailure(error, "Le renommage a échoué.", "Cette spécialité existe déjà.") : changed("specialties")
}

export async function setSpecialtyActive(id: unknown, active: unknown): Promise<Result> {
  await requireAdmin()
  const specialtyId = z.uuid().safeParse(id)
  if (!specialtyId.success || typeof active !== "boolean") return fail("Requête invalide.")

  const supabase = await createClient()
  const { error } = await supabase.from("specialties").update({ active }).eq("id", specialtyId.data)
  return error ? fail("La modification a échoué.") : changed("specialties")
}

// ───────────── Statut des candidatures ─────────────

export async function setCandidateStatus(id: unknown, status: unknown): Promise<Result> {
  await requireAdmin()
  const candidateId = z.uuid().safeParse(id)
  if (!candidateId.success || !isCandidateStatus(status)) return fail("Requête invalide.")

  const supabase = await createClient()
  const { error } = await supabase.from("candidates").update({ status }).eq("id", candidateId.data)
  if (error) return fail("Le changement de statut a échoué.")
  refresh()
  return { ok: true }
}

// ───────────── Actualités ─────────────

const newsSchema = z.object({
  id: z.uuid().optional(),
  title: z.string().trim().min(1, "Le titre est obligatoire.").max(200),
  body: z.string().trim().min(1, "Le texte est obligatoire.").max(5000),
  category: z.enum(NEWS_CATEGORIES, "Catégorie invalide."),
  badge: z.string().trim().min(1, "L'étiquette est obligatoire.").max(40),
  tone: z.enum(NEWS_TONES, "Couleur invalide."),
  kicker: z.string().trim().max(80),
  linkLabel: z.string().trim().max(80),
  linkHref: z
    .string()
    .trim()
    .max(300)
    .refine(
      (v) => v === "" || /^\/[A-Za-z0-9/_#-]*$/.test(v) || /^https:\/\//.test(v),
      "Le lien doit commencer par / (page du site) ou https://."
    ),
  meta: z.string().trim().max(80),
  published: z.boolean(),
})

/** Crée une actualité, ou la met à jour si `id` est fourni. */
export async function saveNews(input: unknown): Promise<Result> {
  await requireAdmin()
  const parsed = newsSchema.safeParse(input)
  if (!parsed.success) return fail(firstIssue(parsed.error))
  const { id, linkLabel, linkHref, ...rest } = parsed.data

  const row = { ...rest, link_label: linkLabel, link_href: linkHref }
  const supabase = await createClient()
  const { error } = id
    ? await supabase.from("news").update(row).eq("id", id)
    : await supabase.from("news").insert(row)
  return error ? fail("L'enregistrement de l'actualité a échoué.") : changed("news")
}

export async function setNewsPublished(id: unknown, published: unknown): Promise<Result> {
  await requireAdmin()
  const newsId = z.uuid().safeParse(id)
  if (!newsId.success || typeof published !== "boolean") return fail("Requête invalide.")

  const supabase = await createClient()
  const { error } = await supabase.from("news").update({ published }).eq("id", newsId.data)
  return error ? fail("La modification a échoué.") : changed("news")
}

export async function deleteNews(id: unknown): Promise<Result> {
  await requireAdmin()
  const newsId = z.uuid().safeParse(id)
  if (!newsId.success) return fail("Requête invalide.")

  const supabase = await createClient()
  const { error } = await supabase.from("news").delete().eq("id", newsId.data)
  return error ? fail("La suppression a échoué.") : changed("news")
}

// ───────────── Galerie ─────────────

const galleryFileSchema = z.object({
  type: z.string().refine((t) => t in GALLERY_MIMES, "Format accepté : JPG, PNG ou WebP."),
  size: z.number().int().positive().max(GALLERY_MAX_SIZE, "La photo dépasse 10 Mo."),
})

const galleryFields = {
  category: z.enum(GALLERY_CATEGORY_IDS, "Catégorie invalide."),
  title: z.string().trim().min(1, "Le titre est obligatoire.").max(200),
  place: z.string().trim().max(120),
  size: z.enum(GALLERY_SIZES).nullable(),
}

/** Étape 1 de l'ajout d'une photo : URL signée pour l'envoyer directement dans le bucket. */
export async function prepareGalleryUpload(
  input: unknown
): Promise<{ ok: true; path: string; token: string } | { ok: false; error: string }> {
  await requireAdmin()
  const file = galleryFileSchema.safeParse(input)
  if (!file.success) return fail(firstIssue(file.error))

  const path = `${randomBytes(12).toString("hex")}.${GALLERY_MIMES[file.data.type]}`
  const { data, error } = await createAdminClient().storage.from(GALLERY_BUCKET).createSignedUploadUrl(path)
  if (error || !data) return fail("Impossible de préparer l'envoi de la photo.")
  return { ok: true, path, token: data.token }
}

/** Étape 2 : enregistre la photo une fois envoyée. */
export async function addGalleryItem(input: unknown): Promise<Result> {
  await requireAdmin()
  const parsed = z
    .object({ ...galleryFields, imagePath: z.string().regex(/^[a-f0-9]{24}\.(jpg|png|webp)$/) })
    .safeParse(input)
  if (!parsed.success) return fail(firstIssue(parsed.error))
  const { imagePath, ...fields } = parsed.data

  const storage = createAdminClient().storage.from(GALLERY_BUCKET)
  const { data: found } = await storage.list("", { search: imagePath })
  if (!found?.some((object) => object.name === imagePath)) return fail("La photo n'a pas été reçue. Réessayez.")

  const supabase = await createClient()
  const { error } = await supabase.from("gallery_items").insert({ ...fields, image_path: imagePath, sort_order: 0 })
  if (error) {
    await storage.remove([imagePath])
    return fail("L'enregistrement de la photo a échoué.")
  }
  return changed("gallery")
}

export async function updateGalleryItem(id: unknown, input: unknown): Promise<Result> {
  await requireAdmin()
  const itemId = z.uuid().safeParse(id)
  const parsed = z.object(galleryFields).safeParse(input)
  if (!itemId.success) return fail("Photo invalide.")
  if (!parsed.success) return fail(firstIssue(parsed.error))

  const supabase = await createClient()
  const { error } = await supabase.from("gallery_items").update(parsed.data).eq("id", itemId.data)
  return error ? fail("La modification a échoué.") : changed("gallery")
}

export async function setGalleryPublished(id: unknown, published: unknown): Promise<Result> {
  await requireAdmin()
  const itemId = z.uuid().safeParse(id)
  if (!itemId.success || typeof published !== "boolean") return fail("Requête invalide.")

  const supabase = await createClient()
  const { error } = await supabase.from("gallery_items").update({ published }).eq("id", itemId.data)
  return error ? fail("La modification a échoué.") : changed("gallery")
}

export async function deleteGalleryItem(id: unknown): Promise<Result> {
  await requireAdmin()
  const itemId = z.uuid().safeParse(id)
  if (!itemId.success) return fail("Requête invalide.")

  const supabase = await createClient()
  const { data: item } = await supabase.from("gallery_items").select("image_path").eq("id", itemId.data).maybeSingle()
  const { error } = await supabase.from("gallery_items").delete().eq("id", itemId.data)
  if (error) return fail("La suppression a échoué.")

  if (item?.image_path) await createAdminClient().storage.from(GALLERY_BUCKET).remove([item.image_path])
  return changed("gallery")
}

// ───────────── Administrateurs ─────────────

const newAdminSchema = z.object({
  email: z.email("Adresse e-mail invalide.").max(180),
  password: z.string().min(8, "Le mot de passe doit comporter au moins 8 caractères.").max(72),
})

/** Crée un compte administrateur (e-mail confirmé d'office, rôle dans app_metadata). */
export async function createAdminAccount(input: unknown): Promise<Result> {
  await requireAdmin()
  const parsed = newAdminSchema.safeParse(input)
  if (!parsed.success) return fail(firstIssue(parsed.error))

  const { error } = await createAdminClient().auth.admin.createUser({
    email: parsed.data.email,
    password: parsed.data.password,
    email_confirm: true,
    app_metadata: { role: "admin" },
  })
  if (error) {
    return fail(/already|registered|exists/i.test(error.message) ? "Un compte existe déjà avec cette adresse." : "La création du compte a échoué.")
  }
  refresh()
  return { ok: true }
}

/** Retire les droits d'administration d'un compte (le compte lui-même est conservé). */
export async function revokeAdminAccount(userId: unknown): Promise<Result> {
  const current = await requireAdmin()
  const id = z.uuid().safeParse(userId)
  if (!id.success) return fail("Compte invalide.")
  if (id.data === current.id) return fail("Vous ne pouvez pas retirer vos propres droits.")

  const { error } = await createAdminClient().auth.admin.updateUserById(id.data, {
    app_metadata: { role: null },
  })
  if (error) return fail("La modification a échoué.")
  refresh()
  return { ok: true }
}
