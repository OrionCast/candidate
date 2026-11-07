import type { Metadata } from "next"
import Link from "next/link"
import { GalleryGrid } from "@/components/site/gallery-grid"
import { Particles } from "@/components/site/particles"
import { getPublishedGallery } from "@/lib/site-data"

export const metadata: Metadata = {
  title: "Galerie",
  description: "Les moments forts du programme PATN : sessions de formation, ateliers pratiques et événements.",
}

export default async function GalleryPage() {
  const photos = await getPublishedGallery()

  return (
    <>
      <section className="hero-bg relative overflow-hidden text-white">
        <Particles density={1 / 18000} link={130} />
        <div className="hero-grid absolute inset-0" />
        <div className="orb orb-1" />
        <div className="orb orb-2" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
          <nav className="mb-8 flex items-center gap-2 text-xs text-emerald-200/80 sm:text-sm" aria-label="Fil d'Ariane">
            <Link href="/" className="transition-colors hover:text-yellow-300">
              Accueil
            </Link>
            <span className="text-emerald-400/60">›</span>
            <span className="font-medium text-white">Galerie</span>
          </nav>

          <div className="max-w-3xl space-y-5">
            <div className="glass inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-[11px] font-bold tracking-wide sm:text-xs">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-yellow-400 opacity-70" />
                <span className="relative inline-flex size-2.5 rounded-full bg-yellow-400" />
              </span>
              GALERIE PHOTOS · FORMATION PATN
            </div>

            <h1 className="font-display text-4xl leading-[1.05] font-bold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="text-white drop-shadow-lg">Les moments forts</span>
              <br />
              <span className="relative text-yellow-300 italic drop-shadow-md">
                du programme PATN.
                <svg
                  className="absolute -bottom-2 left-0 h-3 w-full text-yellow-400/60"
                  viewBox="0 0 300 12"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path d="M2 10C80 2 220 2 298 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-relaxed font-light text-emerald-50/90 sm:text-lg">
              Découvrez en images les sessions de formation, les ateliers pratiques et les temps forts qui rythment le
              parcours des 300 jeunes bénéficiaires du programme.
            </p>
          </div>
        </div>

        <div className="absolute right-0 bottom-0 left-0 h-1.5 bg-gradient-to-r from-emerald-700 via-yellow-400 to-red-600" />
      </section>

      <section className="relative bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="scroll-reveal mb-12 text-center">
            <span className="section-kicker text-congo">Retour en images</span>
            <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Galerie du programme
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg font-light text-slate-500">
              Cliquez sur une photo pour l'agrandir et naviguer dans l'album.
            </p>
          </div>

          <GalleryGrid photos={photos} />
        </div>
      </section>

      <section className="bg-slate-50 pb-20 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="cta-banner scroll-reveal relative overflow-hidden rounded-[2rem] p-9 text-white sm:p-12 lg:p-16">
            <div className="pointer-events-none absolute -top-16 -right-16 size-72 rounded-full border-[32px] border-white/10" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 size-72 rounded-full border-[32px] border-yellow-400/20" />

            <div className="relative z-10 flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-[11px] font-extrabold tracking-[.2em] text-yellow-300 uppercase">Rejoignez la prochaine promotion</p>
                <h2 className="mt-4 font-display text-3xl leading-tight font-bold text-white drop-shadow-sm sm:text-4xl lg:text-[2.6rem]">
                  Envie de vivre ces moments ?
                </h2>
                <p className="mt-4 text-lg font-light text-emerald-50">
                  Déposez votre candidature et faites partie des 300 jeunes bénéficiaires du PATN.
                </p>
              </div>
              <Link
                href="/candidature"
                className="btn-primary inline-flex shrink-0 items-center justify-center gap-3 rounded-2xl bg-yellow-400 px-8 py-4 font-extrabold text-slate-950 shadow-xl shadow-yellow-400/30 hover:-translate-y-1"
              >
                <span>Déposer ma candidature</span>
                <span className="arrow text-lg">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
