import { getAdmin } from "@/lib/auth"
import { fetchAllCandidates } from "@/lib/candidates"
import { STATUS_LABEL } from "@/lib/candidate-status"
import { formatDateOnly, formatDateTime } from "@/lib/format"

const quote = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`

export async function GET() {
  if (!(await getAdmin())) {
    return Response.json({ error: "Connexion administrateur requise." }, { status: 401 })
  }

  const rows = await fetchAllCandidates()
  const headers = [
    "Code référence",
    "Date dépôt",
    "Nom complet",
    "Email",
    "Téléphone",
    "Ville",
    "Adresse",
    "Date naissance",
    "Lieu naissance",
    "Type BAC",
    "Année obtention",
    "Spécialité",
    "Statut",
  ]
  const lines = rows.map((r) =>
    [
      r.ref,
      formatDateTime(r.created_at),
      r.full_name,
      r.email,
      r.phone,
      r.city,
      r.address,
      formatDateOnly(r.date_of_birth),
      r.place_of_birth,
      r.bac_type,
      r.bac_year,
      r.specialty,
      STATUS_LABEL[r.status],
    ]
      .map(quote)
      .join(";")
  )
  // BOM + séparateur « ; » : ouverture directe dans Excel.
  const csv = "﻿" + [headers.map(quote).join(";"), ...lines].join("\r\n")

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="candidatures.csv"',
    },
  })
}
