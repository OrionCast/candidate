import {
  Award01Icon,
  Calendar03Icon,
  Call02Icon,
  CloudIcon,
  File02Icon,
  Globe02Icon,
  Location01Icon,
  Mortarboard01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { Metadata } from "next"
import Link from "next/link"
import type { ReactNode } from "react"
import { Particles } from "@/components/site/particles"
import { getSiteSettings } from "@/lib/site-data"
import { formatLongDate, phoneHref } from "@/lib/site-settings"

export const metadata: Metadata = {
  title: "Accueil",
  description: "Programme PATN : formation gratuite de 300 jeunes en Réseaux, Connectivité et Cloud.",
}

type Icon = Parameters<typeof HugeiconsIcon>[0]["icon"]

function Glyph({ icon, size = 24 }: { icon: Icon; size?: number }) {
  return <HugeiconsIcon icon={icon} size={size} strokeWidth={1.8} />
}

const keyFigures = (places: number): { icon: Icon; tone: string; title: ReactNode; text: string }[] => [
  {
    icon: Mortarboard01Icon,
    tone: "from-emerald-100 to-emerald-50 border-emerald-100 text-congo",
    title: <p className="text-4xl leading-none font-black tracking-tight text-congo">{places}</p>,
    text: "Jeunes à former",
  },
  {
    icon: Location01Icon,
    tone: "from-blue-100 to-blue-50 border-blue-100 text-blue-700",
    title: <p className="text-xl leading-none font-extrabold text-slate-900">Deux villes</p>,
    text: "Brazzaville et Pointe-Noire",
  },
  {
    icon: CloudIcon,
    tone: "from-yellow-100 to-yellow-50 border-yellow-100 text-yellow-700",
    title: <p className="text-xl leading-none font-extrabold text-slate-900">Deux parcours</p>,
    text: "Réseaux et Infrastructure Cloud",
  },
]

const criteria: ReactNode[] = [
  <>
    Être de <strong className="text-slate-900">nationalité congolaise</strong>.
  </>,
  <>
    Être âgé de <strong className="text-slate-900">18 à 30 ans</strong>.
  </>,
  "Être sans emploi ou disponible à temps plein pour suivre la formation.",
  <>
    Être titulaire, au minimum, d'un <strong className="text-slate-900">baccalauréat</strong> (général, technique ou
    professionnel).
  </>,
  "Disposer de compétences numériques générales de base.",
  "Ne pas être actuellement inscrit dans un établissement d'enseignement supérieur.",
  "Démontrer une motivation claire et documentée à suivre la formation.",
]

const documents: ReactNode[] = [
  <>
    Une <strong className="text-slate-900">photo d'identité</strong> (format passeport).
  </>,
  <>
    Une <strong className="text-slate-900">pièce d'identité</strong> (Acte de Naissance, CNI, Passeport ou Permis de
    Conduire).
  </>,
  <>
    Une photocopie du <strong className="text-slate-900">dernier diplôme</strong>.
  </>,
  <>
    Une <strong className="text-slate-900">lettre de motivation (1 page maximum)</strong>, exposant les raisons de la
    candidature et les objectifs post-formation.
  </>,
  <>
    Un <strong className="text-slate-900">CV synthétique (1 page maximum)</strong>, précisant le parcours scolaire et
    les compétences numériques acquises.
  </>,
]

/** Mini-réseau décoratif : relie les points 0-1, 1-2, 2-3 puis 1-4. */
function CardNetwork({ points }: { points: [number, number][] }) {
  return (
    <svg className="card-net" viewBox="0 0 300 120" preserveAspectRatio="xMaxYMid slice" aria-hidden="true">
      {points.slice(1).map(([x, y], i) => (
        <line key={`l${i}`} x1={points[i === 3 ? 1 : i][0]} y1={points[i === 3 ? 1 : i][1]} x2={x} y2={y} />
      ))}
      {points.map(([x, y], i) => (
        <circle key={`c${i}`} cx={x} cy={y} r="3" />
      ))}
    </svg>
  )
}

export default async function HomePage() {
  const settings = await getSiteSettings()
  const places = settings.placesCount
  const opens = formatLongDate(settings.applyOpensAt)
  const closes = formatLongDate(settings.applyClosesAt)

  return (
    <>
      {/* Hero */}
      <section className="hero-bg noise relative overflow-hidden text-white">
        <Particles density={1 / 14000} link={140} />
        <div className="hero-grid absolute inset-0" />
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        <svg className="network hidden md:block" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <line x1="80" y1="120" x2="300" y2="260" />
          <line x1="300" y1="260" x2="520" y2="140" />
          <line x1="520" y1="140" x2="760" y2="300" />
          <line x1="760" y1="300" x2="1020" y2="180" />
          <line x1="300" y1="260" x2="360" y2="520" />
          <line x1="760" y1="300" x2="700" y2="560" />
          <line x1="1020" y1="180" x2="1120" y2="420" />
          <circle cx="80" cy="120" r="3" />
          <circle cx="300" cy="260" r="3" />
          <circle cx="520" cy="140" r="3" />
          <circle cx="760" cy="300" r="3" />
          <circle cx="1020" cy="180" r="3" />
          <circle cx="360" cy="520" r="3" />
          <circle cx="700" cy="560" r="3" />
          <circle cx="1120" cy="420" r="3" />
        </svg>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="reveal lg:col-span-7">
              <div className="glass mb-8 inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-[11px] font-bold tracking-wide sm:text-xs">
                <span className="relative flex size-2.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-yellow-400 opacity-70" />
                  <span className="relative inline-flex size-2.5 rounded-full bg-yellow-400" />
                </span>
                PROGRAMME D'ACCÉLÉRATION DE LA TRANSFORMATION NUMÉRIQUE
              </div>

              <p className="section-kicker mb-5 text-yellow-300/90 before:hidden after:hidden">
                PATN · CCIAMB · Banque mondiale (BIRD)
              </p>

              <h1 className="max-w-3xl font-display text-4xl leading-[1.05] font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
                <span className="text-white drop-shadow-lg">300 jeunes formés</span>
                <br />
                <span className="relative text-yellow-300 italic drop-shadow-md">
                  aux métiers du numérique.
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

              <p className="mt-8 max-w-2xl text-lg leading-relaxed font-light text-emerald-50/90 sm:text-xl">
                Réseaux, connectivité et Cloud : bénéficiez d'une formation gratuite axée sur la pratique pour développer
                vos compétences et préparer votre insertion professionnelle.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/candidature"
                  className="btn-primary inline-flex items-center justify-center gap-3 rounded-2xl bg-yellow-400 px-8 py-4 font-extrabold text-slate-950 shadow-xl shadow-yellow-400/30 hover:-translate-y-1"
                >
                  <span>Déposer ma candidature</span>
                  <span className="arrow text-lg">→</span>
                </Link>
                <a
                  href="#eligibilite"
                  className="glass inline-flex items-center justify-center rounded-2xl px-8 py-4 font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-white/20"
                >
                  Vérifier mon éligibilité
                </a>
              </div>

              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/15 pt-8 text-sm text-emerald-50/85">
                {["Formation gratuite", `${places} places disponibles`, "Brazzaville et Pointe-Noire"].map((label) => (
                  <span key={label} className="flex items-center gap-2.5">
                    <span className="flex size-5 items-center justify-center rounded-full bg-yellow-400/20 text-yellow-300">
                      <HugeiconsIcon icon={Tick02Icon} size={12} strokeWidth={3} />
                    </span>
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="reveal reveal-d2 lg:col-span-5">
              <div className="hero-card-wrap">
                <div className="glass-card relative overflow-hidden rounded-[2rem] p-8 shadow-2xl shadow-black/40 sm:p-9">
                  <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-emerald-600 via-yellow-400 to-red-600" />
                  <div className="absolute -top-16 -right-16 size-44 rounded-full bg-emerald-100/60 blur-2xl" />

                  <div className="relative mb-7 flex items-center justify-between pt-1">
                    <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3.5 py-1.5 text-[11px] font-extrabold tracking-wider text-congo uppercase">
                      Formation PATN
                    </span>
                    <span className="text-congo-blue">
                      <Glyph icon={CloudIcon} size={30} />
                    </span>
                  </div>

                  <h2 className="relative font-display text-2xl leading-tight font-bold text-slate-900 sm:text-3xl">
                    Construisez votre avenir dans le numérique.
                  </h2>
                  <p className="relative mt-3 text-sm leading-relaxed text-slate-500">
                    Un parcours pratique organisé autour d'un socle commun et de deux spécialisations professionnelles.
                  </p>

                  <div className="relative mt-8 grid grid-cols-2 gap-3">
                    <div className="group rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg">
                      <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-congo transition-transform duration-300 group-hover:scale-110">
                        <Glyph icon={Globe02Icon} size={22} />
                      </div>
                      <h3 className="text-sm font-extrabold text-congo">Réseaux & connectivité</h3>
                      <p className="mt-2 text-xs leading-relaxed text-slate-500">Infrastructure, sécurité et administration réseau</p>
                    </div>
                    <div className="group rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg">
                      <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 transition-transform duration-300 group-hover:scale-110">
                        <Glyph icon={CloudIcon} size={22} />
                      </div>
                      <h3 className="text-sm font-extrabold text-blue-800">Infrastructure Cloud</h3>
                      <p className="mt-2 text-xs leading-relaxed text-slate-500">AWS, Azure, GCP et virtualisation</p>
                    </div>
                  </div>

                  <div className="relative mt-7 rounded-xl bg-gradient-to-r from-congo to-congo-dark py-4 text-center text-sm font-bold tracking-wide text-white shadow-lg shadow-congo/25">
                    Formation gratuite · {places} jeunes
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute right-0 bottom-0 left-0 h-1.5 bg-gradient-to-r from-emerald-700 via-yellow-400 to-red-600" />
      </section>

      {/* Repères clés */}
      <section className="relative -mt-px bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {keyFigures(places).map((item, index) => (
              <div
                key={item.text}
                className={`group lift scroll-reveal flex items-center gap-5 rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-6 shadow-soft scroll-delay-${index + 1}`}
              >
                <span
                  className={`flex size-16 items-center justify-center rounded-2xl border bg-gradient-to-br transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110 ${item.tone}`}
                >
                  <Glyph icon={item.icon} size={30} />
                </span>
                <div>
                  {item.title}
                  <p className="mt-1.5 text-xs font-semibold text-slate-500">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Présentation */}
      <section id="presentation" className="relative bg-slate-50 py-24 sm:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(8,116,71,.06),transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="scroll-reveal mx-auto mb-16 max-w-3xl text-center">
            <span className="section-kicker text-congo">À propos du programme</span>
            <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Présentation du projet
            </h2>
            <p className="mt-5 text-lg font-light text-slate-500">
              Une initiative pour renforcer les compétences numériques des jeunes en République du Congo.
            </p>
          </div>

          <div className="grid items-stretch gap-7 lg:grid-cols-12">
            <article className="gradient-border scroll-reveal scroll-reveal-left p-8 shadow-card sm:p-12 lg:col-span-8">
              <div className="mb-8 h-1.5 w-16 rounded-full bg-gradient-to-r from-congo to-yellow-400" />

              <p className="mb-6 text-[15.5px] leading-8 text-slate-600 first-letter:float-left first-letter:mt-1 first-letter:mr-3 first-letter:font-display first-letter:text-6xl first-letter:leading-[.85] first-letter:font-bold first-letter:text-congo">
                Dans le cadre du{" "}
                <strong className="font-semibold text-slate-900">Projet d'Accélération de la Transformation Numérique (PATN)</strong>,
                financé par la <strong className="font-semibold text-slate-900">Banque mondiale (BIRD)</strong>, la{" "}
                <strong className="font-semibold text-slate-900">
                  Chambre de Commerce, d'Industrie, d'Agriculture et des Métiers de Brazzaville (CCIAMB)
                </strong>{" "}
                assure la mise en œuvre d'un programme de formation de{" "}
                <strong className="font-bold text-congo">300 jeunes</strong> en Réseaux, Connectivité et Cloud, dans les
                villes de <strong className="font-semibold text-slate-900">Brazzaville et de Pointe-Noire</strong>.
              </p>

              <p className="mb-6 text-[15.5px] leading-8 text-slate-600">
                Cette initiative vise à renforcer les compétences numériques des jeunes à travers un parcours de formation
                axé sur la pratique, articulé autour d'un socle commun de connaissances et de deux spécialisations :{" "}
                <strong className="font-semibold text-slate-900">Infrastructure Réseaux et Connectivité</strong> et{" "}
                <strong className="font-semibold text-slate-900">Infrastructure Cloud</strong>.
              </p>

              <p className="rounded-r-xl border-l-4 border-yellow-400 bg-gradient-to-r from-yellow-50/70 to-transparent py-3 pl-5 text-[15.5px] leading-8 text-slate-600">
                Le projet ambitionne de faciliter l'accès aux certifications professionnelles internationales, de favoriser
                l'insertion sur le marché du travail et de stimuler l'entrepreneuriat numérique. À travers cette initiative,
                le PATN contribue au développement des compétences numériques et à l'accélération de la transformation
                numérique en République du Congo.
              </p>
            </article>

            <aside className="scroll-reveal scroll-reveal-right grid grid-cols-2 gap-5 lg:col-span-4 lg:grid-cols-1">
              <div className="group relative flex flex-col justify-center overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-congo-dark to-congo p-7 text-white shadow-card">
                <div className="absolute -top-8 -right-8 size-36 rounded-full bg-white/10 transition-transform duration-500 group-hover:scale-125" />
                <div className="absolute -bottom-10 -left-10 size-32 rounded-full bg-yellow-400/10 transition-transform duration-500 group-hover:scale-125" />
                <p className="relative text-sm font-semibold text-emerald-200">Bénéficiaires</p>
                <p className="shimmer relative mt-3 text-7xl font-black tracking-tight text-yellow-300">{places}</p>
                <p className="relative mt-1 text-emerald-100">jeunes à former</p>
              </div>

              <div className="group relative flex flex-col justify-center overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-blue-950 to-blue-800 p-7 text-white shadow-card">
                <div className="absolute -top-8 -right-8 size-36 rounded-full bg-white/10 transition-transform duration-500 group-hover:scale-125" />
                <p className="relative text-sm font-semibold text-blue-200">Lieux de formation</p>
                <p className="relative mt-4 font-display text-2xl font-bold">Brazzaville</p>
                <div className="relative my-3 h-px bg-gradient-to-r from-white/30 to-transparent" />
                <p className="relative font-display text-2xl font-bold">Pointe-Noire</p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Spécialisations */}
      <section className="bg-white py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="scroll-reveal mb-16 text-center">
            <span className="section-kicker text-congo">Parcours de formation</span>
            <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Deux spécialisations au choix
            </h2>
          </div>

          <div className="grid gap-7 md:grid-cols-2">
            <article className="lift group scroll-reveal scroll-reveal-left relative overflow-hidden rounded-[1.75rem] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-white p-9 shadow-card sm:p-11">
              <div className="absolute top-0 right-0 size-48 rounded-full bg-emerald-100/50 blur-3xl transition-colors duration-500 group-hover:bg-emerald-200/50" />
              <span className="absolute top-2 right-6 font-display text-[7rem] leading-none font-bold text-emerald-900/5 select-none">01</span>
              <div className="relative">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-congo to-congo-dark text-white shadow-lg shadow-congo/25 transition-all duration-300 group-hover:-rotate-3 group-hover:scale-110">
                  <Glyph icon={Globe02Icon} size={30} />
                </div>
                <p className="mt-8 text-[11px] font-extrabold tracking-[.2em] text-congo uppercase">Spécialisation 01</p>
                <h3 className="mt-2 font-display text-2xl leading-snug font-bold text-slate-900 sm:text-[1.7rem]">
                  Infrastructure Réseaux et Connectivité
                </h3>
                <p className="mt-4 text-[15px] leading-relaxed text-slate-600">
                  Développez des compétences en infrastructure réseau, connectivité, sécurité et administration des réseaux.
                </p>
                <div className="mt-7 flex flex-wrap gap-2">
                  {["Infrastructure", "Sécurité", "Administration réseau"].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-emerald-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-emerald-800 shadow-sm transition-colors hover:border-congo hover:bg-congo hover:text-white"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>

            <article className="lift group scroll-reveal scroll-reveal-right relative overflow-hidden rounded-[1.75rem] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-white p-9 shadow-card sm:p-11">
              <div className="absolute top-0 right-0 size-48 rounded-full bg-blue-100/50 blur-3xl transition-colors duration-500 group-hover:bg-blue-200/50" />
              <span className="absolute top-2 right-6 font-display text-[7rem] leading-none font-bold text-blue-900/5 select-none">02</span>
              <div className="relative">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-700 to-blue-900 text-white shadow-lg shadow-blue-700/25 transition-all duration-300 group-hover:-rotate-3 group-hover:scale-110">
                  <Glyph icon={CloudIcon} size={30} />
                </div>
                <p className="mt-8 text-[11px] font-extrabold tracking-[.2em] text-blue-700 uppercase">Spécialisation 02</p>
                <h3 className="mt-2 font-display text-2xl leading-snug font-bold text-slate-900 sm:text-[1.7rem]">Infrastructure Cloud</h3>
                <p className="mt-4 text-[15px] leading-relaxed text-slate-600">
                  Découvrez les environnements Cloud, notamment AWS, Azure, GCP et les technologies de virtualisation.
                </p>
                <div className="mt-7 flex flex-wrap gap-2">
                  {["AWS", "Azure", "GCP", "Virtualisation"].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-blue-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-blue-800 shadow-sm transition-colors hover:border-blue-700 hover:bg-blue-700 hover:text-white"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          </div>

          <div className="scroll-reveal mt-8 flex items-start gap-5 rounded-2xl border border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-50 p-6 shadow-soft sm:p-7">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-yellow-400 text-slate-900 shadow-md shadow-yellow-400/30">
              <Glyph icon={Award01Icon} size={24} />
            </span>
            <p className="pt-1 text-sm leading-relaxed text-slate-700 sm:text-[15px]">
              Le projet ambitionne de faciliter l'accès aux{" "}
              <strong className="text-slate-900">certifications professionnelles internationales</strong>, de favoriser
              l'insertion sur le marché du travail et de stimuler l'entrepreneuriat numérique.
            </p>
          </div>
        </div>
      </section>

      {/* Éligibilité */}
      <section id="eligibilite" className="relative bg-slate-50 py-24 sm:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(7,84,166,.05),transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="scroll-reveal mx-auto mb-16 max-w-3xl text-center">
            <span className="section-kicker text-congo">Préparez votre dossier</span>
            <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Êtes-vous éligible ?
            </h2>
            <p className="mt-5 text-lg font-light text-slate-500">
              Consultez les conditions de participation et les documents à fournir avant de postuler.
            </p>
          </div>

          <div className="grid items-stretch gap-7 lg:grid-cols-2">
            <div className="scroll-reveal scroll-reveal-left flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-emerald-100 bg-white shadow-card">
              <div className="relative shrink-0 overflow-hidden bg-gradient-to-br from-congo to-congo-dark p-7 text-white sm:p-8">
                <div className="card-orb-a absolute -top-10 -right-10 size-44 rounded-full bg-white/10" />
                <div className="card-orb-b absolute -bottom-14 right-16 size-32 rounded-full bg-yellow-400/15" />
                <CardNetwork points={[[20, 30], [110, 80], [190, 25], [270, 70], [150, 110]]} />
                <div className="card-sweep" />
                <div className="relative flex items-center gap-4">
                  <span className="flex size-[3.25rem] items-center justify-center rounded-xl bg-white/20 shadow-sm backdrop-blur">
                    <Glyph icon={Tick02Icon} size={26} />
                  </span>
                  <div>
                    <p className="text-[11px] font-bold tracking-[.18em] text-emerald-100 uppercase">Conditions de candidature</p>
                    <h3 className="mt-1 font-display text-2xl font-bold">Critères d'éligibilité</h3>
                  </div>
                </div>
              </div>

              <ol className="grow space-y-2 p-7 sm:p-8">
                {criteria.map((item, index) => (
                  <li key={index} className="check-item group flex items-start gap-4">
                    <span className="number-dot flex shrink-0 items-center justify-center rounded-full bg-emerald-100 font-extrabold text-congo transition-colors duration-300 group-hover:bg-congo group-hover:text-white">
                      {index + 1}
                    </span>
                    <span className="pt-1.5 text-[15px] leading-relaxed text-slate-600">{item}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="scroll-reveal scroll-reveal-right flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-blue-100 bg-white shadow-card">
              <div className="relative shrink-0 overflow-hidden bg-gradient-to-br from-blue-600 to-blue-900 p-7 text-white sm:p-8">
                <div className="card-orb-a absolute -top-10 -right-10 size-44 rounded-full bg-white/10" />
                <div className="card-orb-b absolute -bottom-14 right-16 size-32 rounded-full bg-sky-300/15" />
                <CardNetwork points={[[20, 85], [100, 35], [185, 90], [275, 40], [140, 8]]} />
                <div className="card-sweep" style={{ animationDelay: "-3s" }} />
                <div className="relative flex items-center gap-4">
                  <span className="flex size-[3.25rem] items-center justify-center rounded-xl bg-white/20 shadow-sm backdrop-blur">
                    <Glyph icon={File02Icon} size={26} />
                  </span>
                  <div>
                    <p className="text-[11px] font-bold tracking-[.18em] text-blue-100 uppercase">Constitution du dossier</p>
                    <h3 className="mt-1 font-display text-2xl font-bold">Pièces à fournir</h3>
                  </div>
                </div>
              </div>

              <ol className="grow space-y-2 p-7 sm:p-8">
                {documents.map((item, index) => (
                  <li key={index} className="check-item blue group flex items-start gap-4">
                    <span className="number-dot flex shrink-0 items-center justify-center rounded-full bg-blue-100 font-extrabold text-blue-800 transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white">
                      {index + 1}
                    </span>
                    <span className="pt-1.5 text-[15px] leading-relaxed text-slate-600">{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Calendrier et contacts */}
      <section className="bg-white py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="scroll-reveal mb-16 text-center">
            <span className="section-kicker text-congo">Toutes les informations utiles</span>
            <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Calendrier et contacts
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <article className="lift group scroll-reveal scroll-delay-1 relative overflow-hidden rounded-2xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50/50 p-8 shadow-soft">
              <div className="absolute -top-10 -right-10 size-36 rounded-full bg-yellow-200/40 blur-2xl" />
              <div className="relative flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 text-slate-900 shadow-md shadow-yellow-400/30 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-110">
                <Glyph icon={Calendar03Icon} size={26} />
              </div>
              <p className="relative mt-6 text-[11px] font-extrabold tracking-[.16em] text-yellow-800 uppercase">
                Période de l'appel à candidature
              </p>
              {opens || closes ? (
                <>
                  {opens && <p className="relative mt-3 text-lg leading-snug font-semibold text-slate-900">Du {opens}</p>}
                  {closes && <p className="relative mt-1 text-lg leading-snug font-semibold text-slate-900">Au {closes}</p>}
                </>
              ) : (
                <p className="relative mt-3 text-lg leading-snug font-semibold text-slate-900">Dates à annoncer</p>
              )}
            </article>

            <article className="lift group scroll-reveal scroll-delay-2 relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-green-50/50 p-8 shadow-soft">
              <div className="absolute -top-10 -right-10 size-36 rounded-full bg-emerald-200/40 blur-2xl" />
              <div className="relative flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-congo to-congo-dark text-white shadow-md shadow-congo/30 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-110">
                <Glyph icon={Location01Icon} size={26} />
              </div>
              <p className="relative mt-6 text-[11px] font-extrabold tracking-[.16em] text-congo uppercase">Lieux de formation</p>
              <p className="relative mt-3 text-lg leading-snug font-semibold text-slate-900">Brazzaville</p>
              <p className="relative mt-1 text-lg leading-snug font-semibold text-slate-900">Pointe-Noire</p>
            </article>

            <article className="lift group scroll-reveal scroll-delay-3 relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50/50 p-8 shadow-soft">
              <div className="absolute -top-10 -right-10 size-36 rounded-full bg-blue-200/40 blur-2xl" />
              <div className="relative flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-700 to-blue-900 text-white shadow-md shadow-blue-700/30 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-110">
                <Glyph icon={Call02Icon} size={26} />
              </div>
              <p className="relative mt-6 text-[11px] font-extrabold tracking-[.16em] text-blue-800 uppercase">Pour plus d'informations</p>
              <a href={phoneHref(settings.phonePrimary)} className="relative mt-3 block text-lg leading-snug font-semibold text-slate-900 transition-colors hover:text-blue-800">
                {settings.phonePrimary}
              </a>
              {settings.phoneSecondary && (
                <a href={phoneHref(settings.phoneSecondary)} className="relative mt-1 block text-lg leading-snug font-semibold text-slate-900 transition-colors hover:text-blue-800">
                  {settings.phoneSecondary}
                </a>
              )}
              <a
                href={`mailto:${settings.contactEmail}`}
                className="relative mt-4 block text-sm font-medium break-all text-blue-800 underline-offset-2 hover:underline"
              >
                {settings.contactEmail}
              </a>
            </article>
          </div>

          <div className="scroll-reveal mt-6 flex flex-col gap-5 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-6 shadow-soft transition-colors hover:border-emerald-200 sm:flex-row sm:items-center sm:p-7">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm">
              <Glyph icon={Location01Icon} size={26} />
            </span>
            <div>
              <p className="text-[11px] font-extrabold tracking-[.16em] text-slate-500 uppercase">Adresse</p>
              <p className="mt-1 text-[15px] font-bold text-slate-900">{settings.address}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Appel à l'action final */}
      <section className="bg-white pb-24 sm:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="cta-banner scroll-reveal scroll-reveal-zoom relative overflow-hidden rounded-[2rem] p-9 text-white sm:p-12 lg:p-16">
            <div className="pointer-events-none absolute -top-16 -right-16 size-72 rounded-full border-[32px] border-white/10" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 size-72 rounded-full border-[32px] border-yellow-400/20" />
            <div className="hero-grid pointer-events-none absolute inset-0 opacity-60" />

            <div className="relative z-10 flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-[11px] font-extrabold tracking-[.2em] text-yellow-300 uppercase">
                  Votre avenir dans le numérique commence ici
                </p>
                <h2 className="mt-4 font-display text-3xl leading-tight font-bold text-white drop-shadow-sm sm:text-4xl lg:text-[2.6rem]">
                  Rejoignez les 300 jeunes bénéficiaires du PATN
                </h2>
                <p className="mt-4 text-lg font-light text-emerald-50">Préparez vos pièces et soumettez votre dossier en ligne.</p>
              </div>

              <Link
                href="/candidature"
                className="btn-primary inline-flex shrink-0 items-center justify-center gap-3 rounded-2xl bg-yellow-400 px-8 py-4 font-extrabold text-slate-950 shadow-xl shadow-yellow-400/30 hover:-translate-y-1"
              >
                <span>Accéder au formulaire</span>
                <span className="arrow text-lg">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
