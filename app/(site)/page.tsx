import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRightIcon } from "@/components/site/icons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export const metadata: Metadata = { title: "Accueil" }

const quickSteps = [
  {
    n: "01",
    title: "S'informer",
    text: "Consultez les dernières annonces et vérifiez votre éligibilité.",
    tone: "bg-congo-soft text-congo",
  },
  {
    n: "02",
    title: "Préparer ses pièces",
    text: "Numérisez vos justificatifs officiels au format PDF ou image.",
    tone: "bg-gold/30 text-gold-ink",
  },
  {
    n: "03",
    title: "Soumettre & Suivre",
    text: "Validez votre formulaire et conservez précieusement votre code.",
    tone: "bg-flag-red/10 text-flag-red",
  },
]

const features = [
  {
    icon: "📋",
    kicker: "01 / Guide",
    title: "Comprendre la démarche",
    text: "Prenez connaissance des exigences requises, des critères de sélection et du calendrier officiel.",
    href: "#etapes",
    cta: "Découvrir les étapes",
    tone: "bg-congo-soft text-congo group-hover:bg-congo group-hover:text-white",
    kickerTone: "text-congo",
  },
  {
    icon: "📰",
    kicker: "02 / Informations",
    title: "Rester informé",
    text: "Suivez en direct les communiqués officiels, les mises à jour et les avis de recrutement.",
    href: "/actualites",
    cta: "Voir les actualités",
    tone: "bg-gold/20 text-gold-ink group-hover:bg-gold group-hover:text-slate-900",
    kickerTone: "text-gold-ink",
  },
  {
    icon: "🚀",
    kicker: "03 / Postuler",
    title: "Déposer un dossier",
    text: "Remplissez le formulaire en ligne sécurisé et téléversez vos pièces justificatives instantanément.",
    href: "/candidature",
    cta: "Accéder au formulaire",
    tone: "bg-flag-red/10 text-flag-red group-hover:bg-flag-red group-hover:text-white",
    kickerTone: "text-flag-red",
  },
]

const guide = [
  {
    title: "Prenez connaissance des annonces",
    text: "Lisez attentivement les critères requis, la date limite de soumission et la liste des diplômes acceptés.",
  },
  {
    title: "Rassemblez vos pièces numériques",
    text: "Numérisez votre pièce d'identité valide ainsi que vos attestation(s) ou diplôme(s) au format PDF ou JPG (taille max 5 Mo).",
  },
  {
    title: "Validez et notez votre numéro de dossier",
    text: "Soumettez le formulaire et conservez précieusement le code unique de référence transmis lors de la confirmation.",
  },
]

const dots = (size: number) => ({
  backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
  backgroundSize: `${size}px ${size}px`,
})

export default function HomePage() {
  return (
    <div className="overflow-hidden bg-slate-50">
      {/* Hero */}
      <section
        className="relative overflow-hidden px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-28"
        style={{ background: "linear-gradient(135deg, #05442d 0%, #075b3d 50%, #0a734e 100%)" }}
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.08]" style={dots(20)} />
        <div className="pointer-events-none absolute -top-32 -right-32 size-[28rem] rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 size-[28rem] rounded-full bg-gold/10 blur-3xl" />

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="space-y-8 lg:col-span-7">
            <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-medium tracking-wide backdrop-blur-md sm:text-sm">
              <span className="size-2 animate-pulse rounded-full bg-gold" />
              SERVICE PUBLIC · RÉPUBLIQUE DU CONGO
            </div>

            <h1 className="animate-fade-up font-heading text-4xl leading-[1.1] font-bold sm:text-5xl lg:text-6xl">
              Votre avenir professionnel <br />
              <span className="text-gold italic">commence ici.</span>
            </h1>

            <p className="animate-fade-up max-w-2xl text-lg leading-relaxed font-light text-emerald-100 sm:text-xl">
              Accédez aux opportunités du service public, consultez les avis officiels et soumettez votre
              dossier de candidature en quelques clics via un parcours sécurisé.
            </p>

            <div className="animate-fade-up flex flex-col gap-4 pt-2 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-xl bg-gold px-8 font-bold text-slate-900 shadow-lg shadow-gold/20 hover:-translate-y-0.5 hover:bg-gold/90"
              >
                <Link href="/candidature">
                  Déposer ma candidature <ArrowRightIcon size={20} className="ml-1" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-xl border-white/20 bg-white/10 px-8 font-semibold text-white backdrop-blur-md hover:bg-white/20 hover:text-white"
              >
                <Link href="/actualites">Consulter les actualités</Link>
              </Button>
            </div>

            <div className="animate-fade-up flex flex-wrap items-center gap-6 pt-4 text-sm text-emerald-200">
              {["Procédure 100% en ligne", "Données sécurisées"].map((label) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="flex size-5 items-center justify-center rounded-full bg-emerald-500/30 text-xs font-bold text-gold">
                    ✓
                  </span>
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div className="animate-fade-up relative lg:col-span-5">
            <Card className="relative rounded-2xl border border-gray-100 bg-white p-0 text-gray-800 shadow-2xl transition-transform duration-500 hover:rotate-0 lg:rotate-1">
              <div className="absolute top-0 left-0 h-1.5 w-full rounded-t-xl bg-gradient-to-r from-emerald-600 via-gold to-flag-red" />
              <CardContent className="p-8 pt-10">
                <div className="mb-6 flex items-start justify-between">
                  <Badge className="rounded-md bg-congo-soft px-3 py-1 text-[10px] font-bold tracking-wider text-congo uppercase">
                    Espace Candidat
                  </Badge>
                  <span className="text-2xl">🏛️</span>
                </div>
                <h3 className="mb-3 font-heading text-2xl font-bold text-gray-900">
                  Un dossier simplifié, des démarches clarifiées.
                </h3>
                <p className="mb-6 text-sm leading-relaxed text-gray-600">
                  N'attendez plus. Préparez vos pièces justificatives (carte d'identité, diplômes) et
                  complétez votre formulaire en toute simplicité.
                </p>
                <div className="mb-6 space-y-3 rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Pièce d'identité (PDF/JPG)</span>
                    <span className="font-semibold text-congo">Requis</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 pt-2">
                    <span>Diplômes & Attestations</span>
                    <span className="font-semibold text-congo">Requis</span>
                  </div>
                </div>
                <Button asChild className="h-11 w-full rounded-lg font-semibold shadow-md hover:bg-congo-dark">
                  <Link href="/candidature">Commencer ma démarche →</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Étapes rapides */}
      <section className="border-b border-gray-200 bg-white py-10">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          {quickSteps.map((step) => (
            <div key={step.n} className="flex items-start gap-4">
              <div
                className={`flex size-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold ${step.tone}`}
              >
                {step.n}
              </div>
              <div>
                <h4 className="text-base font-bold text-gray-900">{step.title}</h4>
                <p className="mt-1 text-sm text-gray-500">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Fonctionnalités */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <span className="text-xs font-bold tracking-widest text-congo uppercase">Espace centralisé</span>
            <h2 className="mt-2 font-heading text-3xl font-bold text-gray-900 sm:text-4xl">
              Un accès simple pour toutes vos démarches
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Toutes les fonctionnalités nécessaires pour déposer, suivre et vous informer sur le programme
              de recrutement national.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {features.map((f) => (
              <Card
                key={f.title}
                className="group flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div>
                  <div
                    className={`mb-6 flex size-12 items-center justify-center rounded-xl text-xl transition-colors ${f.tone}`}
                  >
                    {f.icon}
                  </div>
                  <span className={`text-xs font-bold tracking-wider uppercase ${f.kickerTone}`}>{f.kicker}</span>
                  <h3 className="mt-2 mb-3 text-xl font-bold text-gray-900">{f.title}</h3>
                  <p className="mb-6 text-sm leading-relaxed text-gray-600">{f.text}</p>
                </div>
                <Link href={f.href} className="inline-flex items-center text-sm font-bold text-congo hover:underline">
                  {f.cta} <span className="ml-2">→</span>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Guide en 3 étapes */}
      <section id="etapes" className="relative overflow-hidden bg-congo-forest py-20 text-white">
        <div className="pointer-events-none absolute inset-0 opacity-[0.05]" style={dots(24)} />
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="space-y-6 lg:col-span-5">
            <span className="text-xs font-bold tracking-widest text-gold uppercase">Guide candidat</span>
            <h2 className="font-heading text-3xl leading-tight font-bold sm:text-4xl">
              Préparez votre candidature en 3 étapes simples.
            </h2>
            <p className="leading-relaxed font-light text-emerald-100">
              Pour assurer un traitement rapide et efficace de votre dossier, veillez à suivre ces consignes
              avant toute validation.
            </p>
            <div className="pt-4">
              <Button asChild size="lg" className="h-12 rounded-xl bg-gold px-6 font-bold text-slate-900 shadow-lg hover:bg-gold/90">
                <Link href="/candidature">
                  Commencer la démarche <ArrowRightIcon className="ml-1" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="space-y-6 lg:col-span-7">
            {guide.map((item, index) => (
              <div
                key={item.title}
                className="flex gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/10"
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gold text-lg font-bold text-gray-900">
                  {index + 1}
                </div>
                <div>
                  <h3 className="mb-1 text-xl font-bold">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-emerald-100">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-slate-100 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative flex flex-col items-center justify-between gap-8 overflow-hidden rounded-3xl bg-gradient-to-r from-congo to-emerald-800 p-8 text-white shadow-xl sm:p-12 md:flex-row">
            <div className="pointer-events-none absolute -top-20 -right-20 size-64 rounded-full bg-gold/10 blur-3xl" />
            <div className="z-10 space-y-2 text-center md:text-left">
              <span className="text-xs font-bold tracking-widest text-gold uppercase">
                Prêt à poser votre candidature ?
              </span>
              <h2 className="font-heading text-2xl font-bold sm:text-3xl">
                Soumettez votre dossier en quelques minutes
              </h2>
              <p className="text-sm font-light text-emerald-100">
                Assurez-vous d'avoir tous vos documents numérisés prêts à être téléversés.
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="z-10 h-12 shrink-0 rounded-xl bg-gold px-8 font-bold text-slate-900 shadow-lg transition-transform hover:scale-105 hover:bg-gold/90"
            >
              <Link href="/candidature">
                Accéder au formulaire <ArrowRightIcon size={20} className="ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
