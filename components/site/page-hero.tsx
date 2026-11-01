import Link from "next/link"
import { FlagBar } from "@/components/site/flag-bar"

type Props = {
  eyebrow: string
  title: string
  description: string
  current: string
}

/** Bandeau d'en-tête des pages intérieures. */
export function PageHero({ eyebrow, title, description, current }: Props) {
  return (
    <section
      className="relative overflow-hidden text-white"
      style={{ background: "linear-gradient(135deg, #075b3d 0%, #043f2a 100%)" }}
    >
      <div
        className="absolute inset-0 opacity-[0.07]"
        aria-hidden="true"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:py-20">
        <div className="animate-fade-up mb-5 inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white/80">
          <span className="h-px w-8 bg-white/40" />
          {eyebrow}
        </div>
        <h1 className="animate-fade-up mb-4 max-w-3xl font-heading text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        <p className="animate-fade-up mb-6 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
          {description}
        </p>
        <nav className="flex items-center gap-2 text-sm text-white/70" aria-label="Fil d'Ariane">
          <Link href="/" className="transition hover:text-white">
            Accueil
          </Link>
          <span className="text-white/40">›</span>
          <span className="font-semibold text-white">{current}</span>
        </nav>
      </div>
      <FlagBar />
    </section>
  )
}
