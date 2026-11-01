import { Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { ApplyForm } from "@/components/site/apply-form"
import { CheckIcon } from "@/components/site/icons"
import { PageHero } from "@/components/site/page-hero"
import { ResultsSection } from "@/components/site/results-section"

export const metadata: Metadata = { title: "Candidature" }

const checklist = [
  "Vos coordonnées sont exactes",
  "Votre pièce d'identité est lisible",
  "Votre diplôme est au format PDF",
  "CV et lettre de motivation prêts",
]

export default function ApplyPage() {
  return (
    <>
      <PageHero
        eyebrow="Espace candidat"
        title="Déposer une candidature"
        description="Complétez les informations ci-dessous et joignez les pièces demandées. Les champs marqués d'un astérisque sont obligatoires."
        current="Candidature"
      />

      <section
        className="py-12 sm:py-16"
        style={{
          background:
            "radial-gradient(circle at 0% 0%, rgba(7,91,61,0.06), transparent 45%), radial-gradient(circle at 100% 100%, rgba(251,222,74,0.08), transparent 45%), #eef5ee",
        }}
      >
        <div className="mx-auto grid max-w-7xl gap-8 px-5 lg:grid-cols-[320px_1fr]">
          <aside className="animate-fade-up">
            <div className="rounded-2xl border border-congo-line bg-gradient-to-b from-[#f8fdf9] to-white p-6 shadow-[0_4px_16px_rgba(7,91,61,0.06)] lg:sticky lg:top-24">
              <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-congo to-congo-mid text-white shadow-md">
                <CheckIcon size={22} />
              </div>
              <h2 className="mb-2 text-lg font-bold text-slate-800">Avant de commencer</h2>
              <p className="mb-5 text-sm leading-relaxed text-slate-600">
                Pour que votre dossier soit correctement transmis, vérifiez les éléments suivants.
              </p>

              <ul className="mb-6 space-y-3">
                {checklist.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-700">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-congo-mid text-[10px] font-bold text-white">
                      <HugeiconsIcon icon={Tick02Icon} size={12} strokeWidth={3} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mb-5 rounded-lg border border-gold-line bg-gold-soft p-4">
                <p className="mb-1 text-[11px] font-bold tracking-wider text-amber-800 uppercase">À savoir</p>
                <p className="text-sm leading-relaxed text-amber-900">
                  Les fichiers doivent peser <strong>5 Mo maximum</strong> chacun. Après l'envoi, conservez votre
                  code de référence.
                </p>
              </div>

              <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-congo transition-all hover:gap-3">
                Une question ? Contactez-nous <span aria-hidden="true">→</span>
              </Link>
            </div>
          </aside>

          <ApplyForm />
        </div>
      </section>

      <Suspense fallback={<div className="h-48 bg-[#e8f2ea]" />}>
        <ResultsSection />
      </Suspense>
    </>
  )
}
