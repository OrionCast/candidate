import { z } from "zod"

export const CITIES = ["Brazzaville", "Pointe-Noire"] as const

export const MAX_FILE_SIZE = 5 * 1024 * 1024

export const DOCUMENT_KINDS = ["identity", "diploma", "cv", "motivation"] as const
export type DocumentKind = (typeof DOCUMENT_KINDS)[number]

export const DOCUMENT_RULES: Record<
  DocumentKind,
  { label: string; mimes: string[]; hint: string }
> = {
  identity: {
    label: "Pièce d'identité",
    mimes: ["application/pdf", "image/jpeg", "image/png"],
    hint: "PDF, JPG ou PNG · 5 Mo maximum",
  },
  diploma: {
    label: "Diplôme / Attestation",
    mimes: ["application/pdf"],
    hint: "PDF uniquement · 5 Mo maximum",
  },
  cv: { label: "CV", mimes: ["application/pdf"], hint: "PDF uniquement · 5 Mo maximum" },
  motivation: {
    label: "Lettre de motivation",
    mimes: ["application/pdf"],
    hint: "PDF uniquement · 5 Mo maximum",
  },
}

export const MIME_EXTENSIONS: Record<string, string> = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
}

export const applicantSchema = z.object({
  fullName: z.string().trim().min(1, "Le nom complet est obligatoire.").max(140),
  email: z
    .string()
    .trim()
    .max(180)
    .refine((v) => v === "" || z.email().safeParse(v).success, "Adresse e-mail invalide."),
  phone: z.string().trim().min(1, "Le numéro de téléphone est obligatoire.").max(30),
  city: z.enum(CITIES, "Veuillez sélectionner une ville."),
  address: z.string().trim().min(1, "L'adresse est obligatoire.").max(255),
})
export type Applicant = z.infer<typeof applicantSchema>

export const fileMetaSchema = z.object({
  name: z.string().max(255),
  type: z.string().max(100),
  size: z.number().int().positive(),
})
export type FileMeta = z.infer<typeof fileMetaSchema>

/** Retourne un message d'erreur, ou null si le fichier est conforme. */
export function checkFile(kind: DocumentKind, file: { type: string; size: number } | null) {
  const { label, mimes } = DOCUMENT_RULES[kind]
  if (!file || file.size === 0) return `Veuillez sélectionner : ${label}.`
  if (file.size > MAX_FILE_SIZE) return `${label} dépasse 5 Mo.`
  if (!mimes.includes(file.type)) return `Format non autorisé pour : ${label}.`
  return null
}

export const REF_PATTERN = /^CG-\d{4}-\d{6}$/
export const RESULTS_FILE_PATTERN = /^[a-f0-9]{24}\.pdf$/
