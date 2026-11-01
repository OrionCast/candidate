import Link from "next/link"
import { Suspense } from "react"
import { CandidatesTable } from "@/components/admin/candidates-table"
import { LogoutButton } from "@/components/admin/logout-button"
import { ResultsForm } from "@/components/admin/results-form"
import { DownloadIcon, FileTextIcon, MapPinIcon } from "@/components/site/icons"
import { Button } from "@/components/ui/button"
import { requireAdmin } from "@/lib/auth"
import { fetchAllCandidates } from "@/lib/candidates"
import { createClient } from "@/lib/supabase/server"

export default function AdminPage() {
  return (
    <Suspense fallback={<p className="py-20 text-center text-slate-400">Chargement du tableau de bord…</p>}>
      <Dashboard />
    </Suspense>
  )
}

async function Dashboard() {
  await requireAdmin()
  const candidates = await fetchAllCandidates()

  const supabase = await createClient()
  const { data: publication } = await supabase
    .from("publication")
    .select("content, pdf_file")
    .eq("id", 1)
    .maybeSingle()

  const cityCount = new Set(candidates.map((c) => c.city)).size

  const stats = [
    { label: "Total des candidatures", value: candidates.length, icon: <FileTextIcon size={24} />, tone: "bg-congo text-white" },
    { label: "Villes / départements représentés", value: cityCount, icon: <MapPinIcon size={24} />, tone: "bg-gold text-gold-ink" },
  ]

  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 sm:text-3xl">Tableau de bord</h1>
          <p className="mt-1 text-sm text-slate-500 sm:text-base">Suivi et consultation des dossiers reçus.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" className="h-10 gap-2 rounded-lg px-4 font-semibold">
            <Link href="/admin/export" prefetch={false} download>
              <DownloadIcon /> Exporter en CSV
            </Link>
          </Button>
          <LogoutButton />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className={`flex size-14 shrink-0 items-center justify-center rounded-xl shadow-md ${stat.tone}`}>
              {stat.icon}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <strong className="mt-0.5 block text-3xl font-extrabold text-slate-800">{stat.value}</strong>
            </div>
          </div>
        ))}
      </div>

      <CandidatesTable candidates={candidates} />

      <ResultsForm initialContent={publication?.content ?? ""} hasPdf={Boolean(publication?.pdf_file)} />
    </div>
  )
}
