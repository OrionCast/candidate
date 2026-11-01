"use client"

import { useMemo, useState } from "react"
import { getCandidateDocuments, type DocumentUrls } from "@/app/admin/actions"
import { FileTextIcon, SearchIcon } from "@/components/site/icons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { CandidateRow } from "@/lib/candidates"
import { DOCUMENT_KINDS, DOCUMENT_RULES, type DocumentKind } from "@/lib/validation"

const ALL = "all"

// Fuseau fixe : évite tout décalage entre le rendu serveur et le navigateur.
const dateFormat = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "Africa/Brazzaville",
})

// Documents affichables dans un cadre (la pièce d'identité peut être une image).
const PREVIEWABLE: DocumentKind[] = ["diploma", "cv", "motivation"]

type Docs =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; urls: DocumentUrls }

export function CandidatesTable({ candidates }: { candidates: CandidateRow[] }) {
  const [query, setQuery] = useState("")
  const [city, setCity] = useState(ALL)
  const [selected, setSelected] = useState<CandidateRow | null>(null)
  const [docs, setDocs] = useState<Docs>({ status: "loading" })

  const cities = useMemo(() => {
    const counts = new Map<string, number>()
    candidates.forEach((c) => counts.set(c.city, (counts.get(c.city) ?? 0) + 1))
    return [...counts.entries()].sort((a, b) => b[1] - a[1])
  }, [candidates])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return candidates.filter(
      (c) =>
        (city === ALL || c.city === city) &&
        [c.ref, c.full_name, c.phone].some((v) => v.toLowerCase().includes(q))
    )
  }, [candidates, query, city])

  async function openPreview(candidate: CandidateRow) {
    setSelected(candidate)
    setDocs({ status: "loading" })
    try {
      const result = await getCandidateDocuments(candidate.id)
      setDocs(result.ok ? { status: "ready", urls: result.urls } : { status: "error", message: result.error })
    } catch {
      setDocs({ status: "error", message: "Impossible de charger les documents." })
    }
  }

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-5">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Candidatures reçues</h2>
          <p className="mt-0.5 text-sm text-slate-500">Liste des dossiers soumis par les candidats.</p>
        </div>
        <div className="flex w-full flex-wrap gap-2 sm:w-auto">
          <div className="relative flex-1 sm:w-72 sm:flex-none">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher nom, téléphone, réf…"
              aria-label="Rechercher une candidature"
              className="h-10 rounded-lg bg-white pl-10"
            />
          </div>
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger aria-label="Filtrer par ville" className="h-10 rounded-lg bg-white sm:w-auto">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Toutes les villes</SelectItem>
              {cities.map(([name, count]) => (
                <SelectItem key={name} value={name}>
                  {name} ({count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            {["Code réf.", "Date de dépôt", "Nom complet", "Téléphone", "Ville", "Documents"].map((label) => (
              <TableHead key={label} className="px-5 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                {label}
              </TableHead>
            ))}
            <TableHead className="px-5 text-right text-xs font-semibold tracking-wider text-slate-500 uppercase">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((c) => (
            <TableRow key={c.id}>
              <TableCell className="px-5 font-bold">{c.ref}</TableCell>
              <TableCell className="px-5">{dateFormat.format(new Date(c.created_at))}</TableCell>
              <TableCell className="px-5">{c.full_name}</TableCell>
              <TableCell className="px-5">{c.phone}</TableCell>
              <TableCell className="px-5">{c.city}</TableCell>
              <TableCell className="px-5">
                <span className="flex flex-wrap gap-1">
                  <Badge variant="secondary" className="bg-slate-100 text-slate-600">CNI</Badge>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-600">Diplôme</Badge>
                  <Badge variant="secondary">CV</Badge>
                  <Badge variant="secondary">Motiv.</Badge>
                </span>
              </TableCell>
              <TableCell className="px-5 text-right">
                <Button size="sm" variant="outline" className="rounded-lg" onClick={() => openPreview(c)}>
                  Aperçu
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {filtered.length === 0 && (
        <div className="px-5 py-12 text-center">
          <div className="mb-3 inline-flex size-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <FileTextIcon size={24} />
          </div>
          <p className="font-medium text-slate-500">
            {candidates.length === 0 ? "Aucune candidature reçue pour le moment." : "Aucune candidature correspondant à la recherche."}
          </p>
          {candidates.length > 0 && <p className="mt-1 text-sm text-slate-400">Essayez de modifier les filtres ou la recherche.</p>}
        </div>
      )}

      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl sm:max-w-3xl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="pr-10 text-xl font-bold text-slate-800">
                  Dossier de {selected.full_name} — {selected.ref}
                </DialogTitle>
              </DialogHeader>

              <div className="grid gap-3 text-sm sm:grid-cols-2">
                {[
                  ["Téléphone", selected.phone],
                  ["Email", selected.email || "Non renseigné"],
                  ["Ville", selected.city],
                  ["Adresse", selected.address || "Non renseignée"],
                  ["Date de dépôt", dateFormat.format(new Date(selected.created_at))],
                ].map(([label, value]) => (
                  <p key={label}>
                    <strong>{label} :</strong> {value}
                  </p>
                ))}
              </div>

              {docs.status === "loading" && (
                <div role="status" aria-label="Chargement des documents" className="space-y-4">
                  {DOCUMENT_KINDS.map((kind) => (
                    <div key={kind} className="space-y-2">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-4 w-64" />
                    </div>
                  ))}
                </div>
              )}
              {docs.status === "error" && <p className="text-sm text-flag-red">{docs.message}</p>}
              {docs.status === "ready" &&
                DOCUMENT_KINDS.map((kind) => {
                  const url = docs.urls[kind]
                  return (
                    <div key={kind} className="space-y-2">
                      <h3 className="font-bold">{DOCUMENT_RULES[kind].label}</h3>
                      {url ? (
                        <>
                          <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-congo underline underline-offset-2">
                            Ouvrir le document dans un nouvel onglet
                          </a>
                          {PREVIEWABLE.includes(kind) ? (
                            <iframe src={url} title={DOCUMENT_RULES[kind].label} className="h-96 w-full rounded-lg border border-slate-200" />
                          ) : (
                            <p className="text-sm text-slate-500">
                              La pièce d'identité peut être un PDF ou une image. Ouvrez le document pour le consulter.
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="text-sm text-slate-500">Document introuvable.</p>
                      )}
                    </div>
                  )
                })}
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
