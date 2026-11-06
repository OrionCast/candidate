import { strToU8, zipSync } from "fflate"
import { z } from "zod"
import { getAdmin } from "@/lib/auth"
import { formatDateOnly, formatDateTime } from "@/lib/format"
import { createClient } from "@/lib/supabase/server"

type Candidate = {
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
  created_at: string
}

function infoSheet(c: Candidate) {
  return [
    "CANDIDATURE - RÉPUBLIQUE DU CONGO",
    "========================================",
    `Référence          : ${c.ref}`,
    `Nom complet        : ${c.full_name}`,
    `Email              : ${c.email || "Non renseigné"}`,
    `Téléphone          : ${c.phone}`,
    `Date de naissance  : ${formatDateOnly(c.date_of_birth)}`,
    `Lieu de naissance  : ${c.place_of_birth || "—"}`,
    `Type de BAC        : ${c.bac_type || "—"}`,
    `Année d'obtention  : ${c.bac_year ?? "—"}`,
    `Spécialité         : ${c.specialty || "—"}`,
    `Ville              : ${c.city}`,
    `Adresse            : ${c.address || "Non renseignée"}`,
    `Date de dépôt      : ${formatDateTime(c.created_at)}`,
    "",
    "FICHIERS INCLUS",
    "----------------------------------------",
    "0_photo_profil         → Photo de profil (facultatif)",
    "1_piece_identite       → Pièce d'identité",
    "2_diplome              → Diplôme / attestation",
    "3_CV                   → CV",
    "4_lettre_motivation    → Lettre de motivation",
    "",
    "Document généré automatiquement par le Portail de candidature.",
  ].join("\n")
}

/** Archive ZIP d'un candidat : fiche de renseignements + tous ses documents. */
export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await getAdmin())) {
    return Response.json({ error: "Connexion administrateur requise." }, { status: 401 })
  }

  const { id } = await context.params
  if (!z.uuid().safeParse(id).success) {
    return Response.json({ error: "Identifiant invalide." }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: row } = await supabase.from("candidates").select("*").eq("id", id).maybeSingle()
  if (!row) return Response.json({ error: "Candidat introuvable." }, { status: 404 })

  const folder = row.ref as string
  const entries: Record<string, Uint8Array> = {
    [`${folder}/INFORMATIONS_CANDIDAT.txt`]: strToU8(infoSheet(row as Candidate)),
  }

  const documents = [
    { path: row.photo_file as string | null, name: "0_photo_profil" },
    { path: row.id_file as string | null, name: "1_piece_identite" },
    { path: row.diploma_file as string | null, name: "2_diplome" },
    { path: row.cv_file as string | null, name: "3_CV" },
    { path: row.motivation_file as string | null, name: "4_lettre_motivation" },
  ]

  for (const { path, name } of documents) {
    if (!path) continue
    const { data } = await supabase.storage.from("documents").download(path)
    if (!data) continue
    const extension = path.includes(".") ? path.slice(path.lastIndexOf(".")) : ".pdf"
    entries[`${folder}/${name}${extension}`] = new Uint8Array(await data.arrayBuffer())
  }

  // Niveau 0 : les PDF et images sont déjà compressés, inutile de les recompresser.
  const archive = zipSync(entries, { level: 0 })
  const safeName = String(row.full_name).replace(/[^a-zA-Z0-9-_]/g, "_").trim() || "candidat"

  return new Response(new Blob([archive as unknown as BlobPart]), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${folder}_${safeName}.zip"`,
    },
  })
}
