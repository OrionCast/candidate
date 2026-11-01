import { getAdmin } from "@/lib/auth"
import { fetchAllCandidates } from "@/lib/candidates"

const quote = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`

export async function GET() {
  if (!(await getAdmin())) {
    return Response.json({ error: "Connexion administrateur requise." }, { status: 401 })
  }

  const rows = await fetchAllCandidates()
  const headers = ["Code référence", "Date dépôt", "Nom complet", "Email", "Téléphone", "Ville", "Adresse"]
  const lines = rows.map((r) =>
    [
      r.ref,
      new Date(r.created_at).toLocaleString("fr-FR", { timeZone: "Africa/Brazzaville" }),
      r.full_name,
      r.email,
      r.phone,
      r.city,
      r.address,
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
