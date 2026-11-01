import Link from "next/link"
import { Brand } from "@/components/site/brand"

const navigation = [
  { href: "/", label: "Accueil" },
  { href: "/actualites", label: "Actualités" },
  { href: "/candidature", label: "Déposer un dossier" },
  { href: "/contact", label: "Contact" },
]

export function SiteFooter() {
  return (
    <footer className="bg-congo-forest text-white/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-3">
        <div className="space-y-4">
          <Brand light />
          <p className="max-w-xs text-sm leading-relaxed">
            Un espace simple et accessible pour s’informer et déposer son dossier de candidature.
          </p>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-bold text-white">Navigation</h3>
          <ul className="space-y-2 text-sm">
            {navigation.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-gold">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-bold text-white">Besoin d’aide ?</h3>
          <p className="mb-3 text-sm leading-relaxed">
            Consultez les actualités pour les informations relatives au programme ou contactez le service
            concerné.
          </p>
          <Link href="/contact" className="text-sm font-semibold text-gold hover:underline">
            Nous contacter →
          </Link>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-2 px-5 py-4 text-xs text-white/60">
          <span>© 2026 Portail de candidature · République du Congo</span>
          <span>Vert · Jaune · Rouge</span>
        </div>
      </div>
      <div className="flex h-1.5">
        <i className="flex-1 bg-congo" />
        <i className="flex-1 bg-gold" />
        <i className="flex-1 bg-flag-red" />
      </div>
    </footer>
  )
}
