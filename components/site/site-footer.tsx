import { HugeiconsIcon } from "@hugeicons/react"
import { Call02Icon } from "@hugeicons/core-free-icons"
import Link from "next/link"
import { Brand } from "@/components/site/brand"
import { Particles } from "@/components/site/particles"
import { getSiteSettings } from "@/lib/site-data"
import { phoneHref } from "@/lib/site-settings"

const navigation = [
  { href: "/", label: "Accueil" },
  { href: "/actualites", label: "Actualités" },
  { href: "/galerie", label: "Galerie" },
  { href: "/candidature", label: "Candidature" },
  { href: "/contact", label: "Contact" },
]

const tags = ["Réseaux", "Cloud", "Connectivité"]

export async function SiteFooter() {
  const settings = await getSiteSettings()

  return (
    <footer className="footer-green relative text-white">
      <Particles density={1 / 16000} link={120} />
      <div className="footer-grid-bg pointer-events-none absolute inset-0" />
      <div className="orb footer-orb-1" />
      <div className="orb footer-orb-2" />

      <svg className="network hidden md:block" viewBox="0 0 1200 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <line x1="60" y1="90" x2="280" y2="210" />
        <line x1="280" y1="210" x2="500" y2="100" />
        <line x1="500" y1="100" x2="740" y2="260" />
        <line x1="740" y1="260" x2="980" y2="130" />
        <line x1="980" y1="130" x2="1140" y2="320" />
        <line x1="280" y1="210" x2="340" y2="420" />
        <line x1="740" y1="260" x2="680" y2="440" />
        <circle cx="60" cy="90" r="3" />
        <circle cx="280" cy="210" r="3" />
        <circle cx="500" cy="100" r="3" />
        <circle cx="740" cy="260" r="3" />
        <circle cx="980" cy="130" r="3" />
        <circle cx="1140" cy="320" r="3" />
        <circle cx="340" cy="420" r="3" />
        <circle cx="680" cy="440" r="3" />
      </svg>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="scroll-reveal md:col-span-5">
            <Brand light />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-emerald-50/70">
              Programme de formation de 300 jeunes en Réseaux, Connectivité et Cloud dans le cadre du PATN.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold text-emerald-50">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="scroll-reveal scroll-delay-1 md:col-span-3">
            <h3 className="mb-5 text-sm font-bold tracking-[0.14em] text-emerald-200 uppercase">Navigation</h3>
            <div className="grid gap-3 text-sm">
              {navigation.map((link) => (
                <Link key={link.href} href={link.href} className="footer-link text-emerald-50/75">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="scroll-reveal scroll-delay-2 md:col-span-4">
            <h3 className="mb-5 text-sm font-bold tracking-[0.14em] text-emerald-200 uppercase">Besoin d'aide ?</h3>
            <p className="text-sm leading-relaxed text-emerald-50/70">
              Pour toute information relative au programme, contactez le service concerné.
            </p>

            <div className="footer-card mt-5 p-4">
              <div className="flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-yellow-400/15 text-yellow-300">
                  <HugeiconsIcon icon={Call02Icon} size={20} strokeWidth={2} />
                </span>
                <div className="min-w-0">
                  <a href={phoneHref(settings.phonePrimary)} className="block text-sm font-semibold text-white transition-colors hover:text-yellow-300">
                    {settings.phonePrimary}
                  </a>
                  {settings.phoneSecondary && (
                    <a href={phoneHref(settings.phoneSecondary)} className="block text-sm font-semibold text-white transition-colors hover:text-yellow-300">
                      {settings.phoneSecondary}
                    </a>
                  )}
                  <a
                    href={`mailto:${settings.contactEmail}`}
                    className="block text-xs break-all text-emerald-50/70 transition-colors hover:text-yellow-300"
                  >
                    {settings.contactEmail}
                  </a>
                </div>
              </div>
            </div>

            <Link
              href="/contact"
              className="group mt-5 inline-flex items-center gap-2 text-sm font-bold text-yellow-300 transition-colors hover:text-yellow-200"
            >
              Nous contacter
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-xs text-emerald-100/60 sm:flex-row">
          <span className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-yellow-400" />© 2026 Portail de candidature · République du Congo
          </span>
          <span>Programme PATN · CCIAMB</span>
        </div>
      </div>

      <div className="relative z-10 h-1.5 bg-gradient-to-r from-emerald-600 via-yellow-400 to-red-600" />
    </footer>
  )
}
