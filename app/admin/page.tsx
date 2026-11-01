import { Suspense } from "react"
import { CandidatesTable } from "@/components/admin/candidates-table"
import { CitiesCard, type CityRow } from "@/components/admin/cities-card"
import { DashboardSkeleton } from "@/components/admin/dashboard-skeleton"
import { ExportButton } from "@/components/admin/export-button"
import { LogoutButton } from "@/components/admin/logout-button"
import { ResultsForm } from "@/components/admin/results-form"
import { FileTextIcon, MapPinIcon } from "@/components/site/icons"
import { requireAdmin } from "@/lib/auth"
import { fetchAllCandidates } from "@/lib/candidates"
import { createClient } from "@/lib/supabase/server"

export default function AdminPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
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

  const { data: cityData } = await supabase.from("cities").select("id, name, active").order("name")

  const perCity = new Map<string, number>()
  candidates.forEach((c) => perCity.set(c.city, (perCity.get(c.city) ?? 0) + 1))
  const cities: CityRow[] = (cityData ?? []).map((city) => ({
    id: city.id,
    name: city.name,
    active: city.active,
    candidates: perCity.get(city.name) ?? 0,
  }))

  const cityCount = perCity.size

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
          <ExportButton />
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

      <CitiesCard cities={cities} />

      <ResultsForm initialContent={publication?.content ?? ""} hasPdf={Boolean(publication?.pdf_file)} />
    </div>
  )
}
