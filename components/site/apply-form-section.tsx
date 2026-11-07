import Link from "next/link"
import { connection } from "next/server"
import { ApplyForm } from "@/components/site/apply-form"
import { ClockIcon } from "@/components/site/icons"
import { getActiveCities } from "@/lib/cities"
import { currentTime } from "@/lib/clock"
import { getActiveSpecialties, getSiteSettings } from "@/lib/site-data"
import { applicationState, formatLongDate, type ApplicationState, type SiteSettings } from "@/lib/site-settings"
import { bacYearOptions } from "@/lib/validation"

function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="animate-fade-up rounded-2xl border border-gold-line bg-gold-soft p-8 shadow-sm sm:p-10">
      <div className="flex items-start gap-5">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gold text-gold-ink">
          <ClockIcon size={22} />
        </span>
        <div className="space-y-3 text-amber-950">
          <h2 className="text-xl font-bold">{title}</h2>
          <div className="text-sm leading-relaxed text-amber-900">{children}</div>
          <div className="flex flex-wrap gap-4 pt-1 text-sm font-semibold text-congo">
            <Link href="/actualites" className="hover:underline">
              Voir les actualités →
            </Link>
            <Link href="/contact" className="hover:underline">
              Nous contacter →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function Closed({ state, settings }: { state: Exclude<ApplicationState, "open">; settings: SiteSettings }) {
  const opens = formatLongDate(settings.applyOpensAt)
  const closes = formatLongDate(settings.applyClosesAt)

  return state === "not_yet" ? (
    <Notice title="Les candidatures ne sont pas encore ouvertes">
      {opens ? `L'appel à candidature ouvrira le ${opens}.` : "La date d'ouverture sera communiquée prochainement."} Préparez dès
      maintenant vos pièces : photo, pièce d'identité, diplôme, CV et lettre de motivation.
    </Notice>
  ) : (
    <Notice title="L'appel à candidature est clos">
      {closes ? `Les candidatures étaient ouvertes jusqu'au ${closes}.` : "La période de dépôt est terminée."} Consultez les
      actualités pour connaître la suite du processus.
    </Notice>
  )
}

/** Affiche le formulaire quand l'appel est ouvert, sinon un message explicatif. */
export async function ApplyFormSection() {
  // L'ouverture dépend de l'heure : cette partie est rendue à chaque visite.
  await connection()

  const [cities, specialties, settings] = await Promise.all([getActiveCities(), getActiveSpecialties(), getSiteSettings()])

  const state = applicationState(settings, currentTime())
  if (state !== "open") return <Closed state={state} settings={settings} />

  if (cities.length === 0 || specialties.length === 0) {
    return (
      <Notice title="Formulaire momentanément indisponible">
        Le formulaire sera disponible dès que les villes et les spécialités auront été configurées.
      </Notice>
    )
  }

  return <ApplyForm cities={cities} specialties={specialties} bacYears={bacYearOptions()} />
}
