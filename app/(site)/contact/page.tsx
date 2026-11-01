import type { Metadata } from "next"
import Link from "next/link"
import { ContactForm } from "@/components/site/contact-form"
import { FlagBar } from "@/components/site/flag-bar"
import { MessageIcon } from "@/components/site/icons"
import { PageHero } from "@/components/site/page-hero"

export const metadata: Metadata = { title: "Contact" }

const topics = [
  {
    symbol: "?",
    tone: "bg-gradient-to-br from-congo to-congo-mid text-white",
    title: "Question sur une candidature",
    text: "Précisez à quelle étape vous rencontrez une difficulté.",
  },
  {
    symbol: "▤",
    tone: "bg-gradient-to-br from-gold to-gold-line text-gold-ink",
    title: "Documents et formats",
    text: "Consultez la page candidature pour connaître les formats acceptés.",
    href: "/candidature",
    cta: "Consulter les consignes →",
  },
  {
    symbol: "◷",
    tone: "bg-gradient-to-br from-flag-red to-[#b81c18] text-white",
    title: "Résultats et annonces",
    text: "Les informations disponibles sont publiées dans la rubrique actualités.",
    href: "/actualites",
    cta: "Voir les actualités →",
  },
]

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Nous contacter"
        description="Une question sur la procédure ? Écrivez au service chargé des candidatures."
        current="Contact"
      />

      <section
        className="py-12 sm:py-16"
        style={{
          background:
            "radial-gradient(circle at 0% 0%, rgba(7,91,61,0.06), transparent 45%), radial-gradient(circle at 100% 100%, rgba(251,222,74,0.08), transparent 45%), #eef5ee",
        }}
      >
        <div className="mx-auto grid max-w-7xl gap-8 px-5 lg:grid-cols-[380px_1fr]">
          <aside className="animate-fade-up">
            <div className="rounded-2xl border border-congo-line bg-gradient-to-b from-[#f8fdf9] to-white p-6 shadow-[0_4px_16px_rgba(7,91,61,0.06)] lg:sticky lg:top-24">
              <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-congo to-congo-mid text-white shadow-md">
                <MessageIcon size={22} />
              </div>
              <h2 className="mb-2 text-lg font-bold text-slate-800">Restons en contact.</h2>
              <p className="mb-6 text-sm leading-relaxed text-slate-600">
                Pour toute question sur la procédure, indiquez clairement le sujet de votre demande. N'envoyez pas
                de documents personnels par le formulaire de contact.
              </p>

              {topics.map((topic, index) => (
                <div key={topic.title}>
                  {index > 0 && <div className="my-5 h-px bg-slate-200" />}
                  <div className="flex items-start gap-4">
                    <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl font-bold ${topic.tone}`}>
                      {topic.symbol}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800">{topic.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">{topic.text}</p>
                      {topic.href && (
                        <Link href={topic.href} className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-congo transition-all hover:gap-2">
                          {topic.cta}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <section className="animate-fade-up overflow-hidden rounded-2xl border border-congo-line bg-white shadow-[0_4px_16px_rgba(7,91,61,0.05)]">
            <FlagBar className="h-1 bg-gradient-to-r from-congo via-congo-mid to-gold" />
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e2ede5] bg-gradient-to-b from-[#f8fdf9] to-white p-6 sm:p-8">
              <div>
                <div className="mb-1 text-[11px] font-bold tracking-[0.2em] text-congo uppercase">Écrivez-nous</div>
                <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">Votre message</h2>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-flag-red">
                * Obligatoire
              </span>
            </div>
            <ContactForm />
          </section>
        </div>
      </section>
    </>
  )
}
