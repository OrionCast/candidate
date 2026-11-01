import type { Metadata } from "next"
import Link from "next/link"
import { NewsList } from "@/components/site/news-list"
import { PageHero } from "@/components/site/page-hero"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = { title: "Actualités" }

export default function NewsPage() {
  return (
    <>
      <PageHero
        eyebrow="Informations & communiqués"
        title="Actualités & annonces officielles"
        description="Retrouvez toutes les informations pratiques, les conseils de préparation et les communiqués relatifs aux appels à candidature du service public."
        current="Actualités"
      />

      <NewsList />

      <section className="bg-[#eef5ee] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className="relative flex flex-col items-center justify-between gap-8 overflow-hidden rounded-3xl p-8 text-white shadow-xl sm:p-12 md:flex-row"
            style={{ background: "linear-gradient(135deg, #075b3d 0%, #05442d 100%)" }}
          >
            <div className="pointer-events-none absolute -top-20 -right-20 size-64 rounded-full bg-gold/10 blur-3xl" />
            <div className="z-10 space-y-2 text-center md:text-left">
              <span className="text-[11px] font-bold tracking-[0.2em] text-gold uppercase">Espace candidat</span>
              <h2 className="font-heading text-2xl font-bold sm:text-3xl">Prêt à déposer votre dossier ?</h2>
              <p className="text-sm font-light text-emerald-100">
                Accédez au formulaire sécurisé et complétez votre demande en quelques minutes.
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="z-10 h-12 shrink-0 rounded-xl bg-gold px-8 font-bold text-slate-900 shadow-lg hover:bg-gold/90"
            >
              <Link href="/candidature">Accéder au formulaire →</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
