import { z } from "zod"

const MB = 1024 * 1024

/** Taille maximale d'un document (30 Mo, comme le projet d'origine). */
export const MAX_FILE_SIZE = 30 * MB

/** Documents obligatoires. */
export const REQUIRED_DOCUMENTS = ["identity", "diploma", "cv", "motivation"] as const

/** La photo de profil est facultative. */
export const DOCUMENT_KINDS = ["photo", ...REQUIRED_DOCUMENTS] as const
export type DocumentKind = (typeof DOCUMENT_KINDS)[number]

export const DOCUMENT_RULES: Record<
  DocumentKind,
  { label: string; mimes: string[]; maxSize: number; hint: string }
> = {
  photo: {
    label: "Photo de profil",
    mimes: ["image/jpeg", "image/png"],
    maxSize: 2 * MB,
    hint: "JPG ou PNG · 2 Mo maximum",
  },
  identity: {
    label: "Pièce d'identité",
    mimes: ["application/pdf", "image/jpeg", "image/png"],
    maxSize: MAX_FILE_SIZE,
    hint: "PDF, JPG ou PNG · 30 Mo maximum",
  },
  diploma: {
    label: "Diplôme / Attestation",
    mimes: ["application/pdf"],
    maxSize: MAX_FILE_SIZE,
    hint: "PDF uniquement · 30 Mo maximum",
  },
  cv: {
    label: "CV",
    mimes: ["application/pdf"],
    maxSize: MAX_FILE_SIZE,
    hint: "PDF uniquement · 30 Mo maximum",
  },
  motivation: {
    label: "Lettre de motivation",
    mimes: ["application/pdf"],
    maxSize: MAX_FILE_SIZE,
    hint: "PDF uniquement · 30 Mo maximum",
  },
}

export const MIME_EXTENSIONS: Record<string, string> = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
}

export const BAC_TYPES = ["A", "C", "D", "G1", "G2", "G3", "BG", "F", "R"] as const
export const BAC_YEARS = Array.from({ length: 12 }, (_, i) => String(2026 - i)) as [string, ...string[]] // 2026 → 2015
export const SPECIALTIES = ["Infrastructure Réseaux et Connectivité", "Infrastructure Cloud"] as const

const MIN_AGE = 14

function isValidBirthDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return "La date de naissance est invalide."
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "La date de naissance est invalide."
  const now = new Date()
  if (date > now) return "La date de naissance ne peut pas être dans le futur."
  const age = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
  if (age < MIN_AGE) return `Vous devez avoir au moins ${MIN_AGE} ans pour candidater.`
  return null
}

export const applicantSchema = z.object({
  fullName: z.string().trim().min(1, "Le nom complet est obligatoire.").max(140),
  email: z
    .string()
    .trim()
    .max(180)
    .refine((v) => v === "" || z.email().safeParse(v).success, "Adresse e-mail invalide."),
  dateOfBirth: z.string().trim().min(1, "La date de naissance est obligatoire.").superRefine((value, ctx) => {
    const problem = isValidBirthDate(value)
    if (problem) ctx.addIssue({ code: "custom", message: problem })
  }),
  placeOfBirth: z.string().trim().min(1, "Le lieu de naissance est obligatoire.").max(120),
  bacType: z.enum(BAC_TYPES, "Veuillez sélectionner le type de BAC."),
  bacYear: z.enum(BAC_YEARS, "Veuillez sélectionner l'année d'obtention du BAC."),
  specialty: z.enum(SPECIALTIES, "Veuillez sélectionner une spécialité."),
  phone: z.string().trim().min(1, "Le numéro de téléphone est obligatoire.").max(30),
  // L'appartenance à la liste des villes actives est vérifiée côté serveur.
  city: z.string().trim().min(1, "Veuillez sélectionner une ville.").max(100),
  address: z.string().trim().min(1, "L'adresse est obligatoire.").max(255),
})
export type Applicant = z.infer<typeof applicantSchema>

export const fileMetaSchema = z.object({
  name: z.string().max(255),
  type: z.string().max(100),
  size: z.number().int().positive(),
})
export type FileMeta = z.infer<typeof fileMetaSchema>

const sizeLabel = (bytes: number) => `${bytes / MB} Mo`

/**
 * Retourne un message d'erreur, ou null si le fichier est conforme.
 * La photo est facultative : son absence n'est pas une erreur.
 */
export function checkFile(kind: DocumentKind, file: { type: string; size: number } | null) {
  const { label, mimes, maxSize } = DOCUMENT_RULES[kind]
  if (!file || file.size === 0) return kind === "photo" ? null : `Veuillez sélectionner : ${label}.`
  if (file.size > maxSize) return `${label} dépasse ${sizeLabel(maxSize)}.`
  if (!mimes.includes(file.type)) return `Format non autorisé pour : ${label}.`
  return null
}

export const cityNameSchema = z
  .string()
  .trim()
  .min(1, "Le nom de la ville est obligatoire.")
  .max(100, "Le nom de la ville est trop long (100 caractères maximum).")

export const REF_PATTERN = /^CG-\d{4}-\d{6}$/
export const RESULTS_FILE_PATTERN = /^[a-f0-9]{24}\.pdf$/
