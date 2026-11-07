"use client"

import { useMemo, useState, useTransition } from "react"
import { getCandidateDocuments, type DocumentUrls } from "@/app/admin/actions"
import { setCandidateStatus } from "@/app/admin/content-actions"
import { DownloadButton } from "@/components/admin/download-button"
import { FileTextIcon, SearchIcon } from "@/components/site/icons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  CANDIDATE_STATUSES,
  STATUS_LABEL,
  STATUS_TONE,
  isCandidateStatus,
  type CandidateStatus,
} from "@/lib/candidate-status"
import type { CandidateRow } from "@/lib/candidates"
import { formatDateOnly, formatDateTime } from "@/lib/format"
import { DOCUMENT_RULES, REQUIRED_DOCUMENTS, type DocumentKind } from "@/lib/validation"

const ALL = "all"

// Documents affichables dans un cadre (la pièce d'identité peut être une image).
const PREVIEWABLE: DocumentKind[] = ["diploma", "cv", "motivation"]

function Avatar({ url, name, className }: { url: string | null; name: string; className?: string }) {
  if (!url) {
    return (
      <span
        aria-hidden="true"
        className={`inline-flex size-10 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-400 ${className ?? ""}`}
      >
        {name.trim().charAt(0).toUpperCase() || "-"}
      </span>
    )
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={url} alt="" className={`size-10 rounded-full border border-slate-200 object-cover ${className ?? ""}`} />
}

/** Changement de statut en un clic, directement dans la ligne du tableau. */
function StatusSelect({ candidate }: { candidate: CandidateRow }) {
  const [pending, startTransition] = useTransition()

  return (
    <div className="flex items-center gap-1.5">
      {pending && <Spinner />}
      <Select
        value={candidate.status}
        disabled={pending}
        onValueChange={(value) => {
          if (!isCandidateStatus(value)) return
          startTransition(async () => {
            await setCandidateStatus(candidate.id, value)
          })
        }}
      >
        <SelectTrigger
          aria-label={`Statut de ${candidate.full_name}`}
          size="sm"
          className={`h-8 rounded-full border-0 px-3 text-xs font-semibold ${STATUS_TONE[candidate.status]}`}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {CANDIDATE_STATUSES.map((status) => (
            <SelectItem key={status} value={status}>
              {STATUS_LABEL[status]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

type Docs =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; urls: DocumentUrls }

export function CandidatesTable({ candidates }: { candidates: CandidateRow[] }) {
  const [query, setQuery] = useState("")
  const [city, setCity] = useState(ALL)
  const [statusFilter, setStatusFilter] = useState<CandidateStatus | typeof ALL>(ALL)
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
        (statusFilter === ALL || c.status === statusFilter) &&
        [c.ref, c.full_name, c.phone, c.email, c.bac_type, c.bac_year, c.specialty].some((v) =>
          String(v ?? "").toLowerCase().includes(q)
        )
    )
  }, [candidates, query, city, statusFilter])

  const statusCounts = useMemo(() => {
    const counts: Record<CandidateStatus, number> = { pending: 0, accepted: 0, rejected: 0 }
    candidates.forEach((c) => counts[c.status]++)
    return counts
  }, [candidates])

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
              placeholder="Rechercher nom, téléphone, réf, BAC…"
              aria-label="Rechercher une candidature"
              className="h-10 rounded-lg bg-white pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as CandidateStatus | typeof ALL)}>
            <SelectTrigger aria-label="Filtrer par statut" className="h-10 rounded-lg bg-white sm:w-auto">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Tous les statuts</SelectItem>
              {CANDIDATE_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {STATUS_LABEL[status]} ({statusCounts[status]})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            {[
              "Photo",
              "Code réf.",
              "Date de dépôt",
              "Nom complet",
              "Téléphone",
              "Ville",
              "Date naiss.",
              "Lieu naiss.",
              "BAC",
              "Année",
              "Spécialité",
              "Statut",
              "Documents",
            ].map((label) => (
              <TableHead key={label} className="px-5 text-xs font-semibold tracking-wider whitespace-nowrap text-slate-500 uppercase">
                {label}
              </TableHead>
            ))}
            <TableHead className="px-5 text-right text-xs font-semibold tracking-wider text-slate-500 uppercase">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((c) => (
            <TableRow key={c.id}>
              <TableCell className="px-5">
                <Avatar url={c.photo_url} name={c.full_name} />
              </TableCell>
              <TableCell className="px-5 font-bold whitespace-nowrap">{c.ref}</TableCell>
              <TableCell className="px-5 whitespace-nowrap">{formatDateTime(c.created_at)}</TableCell>
              <TableCell className="px-5">{c.full_name}</TableCell>
              <TableCell className="px-5 whitespace-nowrap">{c.phone}</TableCell>
              <TableCell className="px-5">{c.city}</TableCell>
              <TableCell className="px-5 whitespace-nowrap">{formatDateOnly(c.date_of_birth)}</TableCell>
              <TableCell className="px-5">{c.place_of_birth || "—"}</TableCell>
              <TableCell className="px-5">{c.bac_type || "—"}</TableCell>
              <TableCell className="px-5">{c.bac_year ?? "—"}</TableCell>
              <TableCell className="px-5">{c.specialty || "—"}</TableCell>
              <TableCell className="px-5">
                <StatusSelect candidate={c} />
              </TableCell>
              <TableCell className="px-5">
                <span className="flex flex-wrap gap-1">
                  <Badge variant="secondary" className="bg-slate-100 text-slate-600">CNI</Badge>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-600">Diplôme</Badge>
                  <Badge variant="secondary">CV</Badge>
                  <Badge variant="secondary">Motiv.</Badge>
                </span>
              </TableCell>
              <TableCell className="px-5">
                <div className="flex items-center justify-end gap-1.5">
                  <Button size="sm" variant="outline" className="rounded-lg" onClick={() => openPreview(c)}>
                    Aperçu
                  </Button>
                  <DownloadButton
                    href={`/admin/candidates/${c.id}/zip`}
                    fallbackName={`${c.ref}.zip`}
                    label="ZIP"
                    busyLabel="ZIP…"
                    size="sm"
                    variant="default"
                    className="h-8 gap-1.5 rounded-lg px-3"
                  />
                </div>
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
                <div className="flex items-center gap-4 pr-10">
                  <Avatar url={selected.photo_url} name={selected.full_name} className="size-20 text-2xl shadow-sm" />
                  <DialogTitle className="text-xl font-bold text-slate-800">
                    Dossier de {selected.full_name} — {selected.ref}
                  </DialogTitle>
                </div>
              </DialogHeader>

              <div className="grid gap-3 text-sm sm:grid-cols-2">
                {[
                  ["Téléphone", selected.phone],
                  ["Email", selected.email || "Non renseigné"],
                  ["Date de naissance", selected.date_of_birth ? formatDateOnly(selected.date_of_birth) : "Non renseignée"],
                  ["Lieu de naissance", selected.place_of_birth || "Non renseigné"],
                  ["Type de BAC", selected.bac_type || "Non renseigné"],
                  ["Année d'obtention", selected.bac_year ? String(selected.bac_year) : "Non renseignée"],
                  ["Spécialité", selected.specialty || "Non renseignée"],
                  ["Statut", STATUS_LABEL[selected.status]],
                  ["Ville", selected.city],
                  ["Adresse", selected.address || "Non renseignée"],
                  ["Date de dépôt", formatDateTime(selected.created_at)],
                ].map(([label, value]) => (
                  <p key={label}>
                    <strong>{label} :</strong> {value}
                  </p>
                ))}
              </div>

              {docs.status === "loading" && (
                <div role="status" aria-label="Chargement des documents" className="space-y-4">
                  {REQUIRED_DOCUMENTS.map((kind) => (
                    <div key={kind} className="space-y-2">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-4 w-64" />
                    </div>
                  ))}
                </div>
              )}
              {docs.status === "error" && <p className="text-sm text-flag-red">{docs.message}</p>}
              {docs.status === "ready" &&
                REQUIRED_DOCUMENTS.map((kind) => {
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
