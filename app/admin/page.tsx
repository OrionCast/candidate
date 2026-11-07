import { Suspense } from "react"
import { addCity, renameCity, setCityActive } from "@/app/admin/actions"
import { addSpecialty, renameSpecialty, setSpecialtyActive } from "@/app/admin/content-actions"
import { AdminTabs } from "@/components/admin/admin-tabs"
import { AdminsCard } from "@/components/admin/admins-card"
import { CandidatesTable } from "@/components/admin/candidates-table"
import { DashboardSkeleton } from "@/components/admin/dashboard-skeleton"
import { DownloadButton } from "@/components/admin/download-button"
import { GalleryManager } from "@/components/admin/gallery-manager"
import { LogoutButton } from "@/components/admin/logout-button"
import { ManagedListCard, type ManagedItem } from "@/components/admin/managed-list-card"
import { NewsManager } from "@/components/admin/news-manager"
import { ResultsForm } from "@/components/admin/results-form"
import { SettingsCard } from "@/components/admin/settings-card"
import { FileTextIcon, MapPinIcon } from "@/components/site/icons"
import { listAdmins } from "@/lib/admins"
import { requireAdmin } from "@/lib/auth"
import { currentTime } from "@/lib/clock"
import { fetchAllCandidates } from "@/lib/candidates"
import { GALLERY_BUCKET, GALLERY_COLUMNS, mapGallery } from "@/lib/gallery"
import { NEWS_COLUMNS, mapNews } from "@/lib/news"
import { mapSettings } from "@/lib/site-settings"
import { createClient } from "@/lib/supabase/server"

export default function AdminPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <Dashboard />
    </Suspense>
  )
}

/** Compte les candidatures par valeur (ville, spécialité). */
function countBy(values: (string | null)[]) {
  const counts = new Map<string, number>()
  values.forEach((value) => value && counts.set(value, (counts.get(value) ?? 0) + 1))
  return counts
}

async function Dashboard() {
  const admin = await requireAdmin()
  const candidates = await fetchAllCandidates()
  const supabase = await createClient()

  const [publication, cityRows, specialtyRows, settingsRow, newsRows, galleryRows, admins] = await Promise.all([
    supabase.from("publication").select("content, pdf_file").eq("id", 1).maybeSingle(),
    supabase.from("cities").select("id, name, active").order("name"),
    supabase.from("specialties").select("id, name, active").order("name"),
    supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
    supabase.from("news").select(NEWS_COLUMNS).order("published_at", { ascending: false }),
    supabase
      .from("gallery_items")
      .select(GALLERY_COLUMNS)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false }),
    listAdmins(),
  ])

  const perCity = countBy(candidates.map((c) => c.city))
  const perSpecialty = countBy(candidates.map((c) => c.specialty))

  const toItems = (rows: { id: string; name: string; active: boolean }[] | null, counts: Map<string, number>): ManagedItem[] =>
    (rows ?? []).map((row) => ({ ...row, count: counts.get(row.name) ?? 0 }))

  const publicUrl = (path: string) => supabase.storage.from(GALLERY_BUCKET).getPublicUrl(path).data.publicUrl
  const gallery = (galleryRows.data ?? []).flatMap((row) => mapGallery(row, publicUrl) ?? [])
  const news = (newsRows.data ?? []).map(mapNews)
  const settings = mapSettings(settingsRow.data)

  const stats = [
    { label: "Total des candidatures", value: candidates.length, icon: <FileTextIcon size={24} />, tone: "bg-congo text-white" },
    { label: "Villes / départements représentés", value: perCity.size, icon: <MapPinIcon size={24} />, tone: "bg-gold text-gold-ink" },
  ]

  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 sm:text-3xl">Tableau de bord</h1>
          <p className="mt-1 text-sm text-slate-500 sm:text-base">Suivi des dossiers et gestion du contenu du site.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <DownloadButton href="/admin/export" fallbackName="candidatures.csv" label="Exporter en CSV" busyLabel="Export en cours…" />
          <LogoutButton />
        </div>
      </div>

      <AdminTabs
        candidates={
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                  <div className={`flex size-14 shrink-0 items-center justify-center rounded-xl shadow-md ${stat.tone}`}>{stat.icon}</div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                    <strong className="mt-0.5 block text-3xl font-extrabold text-slate-800">{stat.value}</strong>
                  </div>
                </div>
              ))}
            </div>
            <CandidatesTable candidates={candidates} />
          </>
        }
        content={
          <>
            <NewsManager items={news} />
            <GalleryManager items={gallery} />
          </>
        }
        settings={
          <>
            <SettingsCard settings={settings} now={currentTime()} />
            <ManagedListCard
              title="Villes disponibles"
              description="Proposées sur le formulaire de candidature. Une ville désactivée disparaît du formulaire mais reste dans les filtres et l'historique."
              icon={<MapPinIcon size={18} />}
              iconTone="bg-gold text-gold-ink"
              items={toItems(cityRows.data, perCity)}
              countNoun="candidature"
              placeholder="Nom de la nouvelle ville"
              emptyText="Aucune ville. Ajoutez-en une pour ouvrir les candidatures."
              renameNote="Renommer ne change pas les candidatures déjà déposées : elles gardent l'ancien nom."
              actions={{ add: addCity, rename: renameCity, setActive: setCityActive }}
            />
            <ManagedListCard
              title="Spécialités"
              description="Proposées sur le formulaire de candidature. Une spécialité désactivée disparaît du formulaire mais reste dans l'historique."
              icon={<FileTextIcon size={18} />}
              iconTone="bg-congo text-white"
              items={toItems(specialtyRows.data, perSpecialty)}
              countNoun="candidature"
              placeholder="Nom de la nouvelle spécialité"
              emptyText="Aucune spécialité. Ajoutez-en une pour ouvrir les candidatures."
              renameNote="Renommer ne change pas les candidatures déjà déposées : elles gardent l'ancien nom."
              actions={{ add: addSpecialty, rename: renameSpecialty, setActive: setSpecialtyActive }}
            />
            <ResultsForm initialContent={publication.data?.content ?? ""} hasPdf={Boolean(publication.data?.pdf_file)} />
            <AdminsCard admins={admins} currentUserId={admin.id} />
          </>
        }
      />
    </div>
  )
}
