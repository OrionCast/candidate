"use client"

import { InformationCircleIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"
import { useMemo, useState } from "react"
import { SearchIcon } from "@/components/site/icons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { NEWS, NEWS_CATEGORIES, type NewsItem } from "@/lib/news"
import { cn } from "@/lib/utils"

const toneClass: Record<NewsItem["tone"], string> = {
  info: "border-congo-line bg-congo-soft text-congo",
  warning: "border-gold-line bg-gold-soft text-amber-800",
  danger: "border-red-200 bg-red-50 text-red-700",
}

export function NewsList() {
  const [category, setCategory] = useState<string | null>(null)
  const [query, setQuery] = useState("")

  const items = useMemo(() => {
    const q = query.trim().toLowerCase()
    return NEWS.filter(
      (item) =>
        (!category || item.category === category) &&
        (!q || [item.title, item.text, item.kicker].some((v) => v.toLowerCase().includes(q)))
    )
  }, [category, query])

  return (
    <>
      <section className="sticky top-24 z-20 sm:top-28 border-b border-congo-line bg-white/95 py-5 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="flex flex-wrap items-center gap-2">
            {[null, ...NEWS_CATEGORIES].map((name) => (
              <Button
                key={name ?? "all"}
                type="button"
                size="sm"
                variant={category === name ? "default" : "outline"}
                onClick={() => setCategory(name)}
                className={cn("rounded-xl", category !== name && "bg-white text-slate-600")}
              >
                {name ?? "Toutes les annonces"}
              </Button>
            ))}
          </div>
          <div className="relative w-full md:w-72">
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher une information..."
              aria-label="Rechercher une information"
              className="h-10 rounded-xl bg-white pl-10"
            />
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-2 border-b border-slate-200 pb-4 sm:flex-row sm:items-end">
            <div>
              <span className="text-[11px] font-bold tracking-[0.2em] text-congo uppercase">Avis publics</span>
              <h2 className="mt-1 font-heading text-2xl font-bold text-slate-900 sm:text-3xl">
                Dernières publications
              </h2>
            </div>
            <span className="text-xs text-slate-500">
              {items.length} publication{items.length > 1 ? "s" : ""}
            </span>
          </div>

          {items.length === 0 && (
            <p className="py-12 text-center font-medium text-slate-500">Aucune publication ne correspond à votre recherche.</p>
          )}

          <div className="grid gap-8 md:grid-cols-2">
            {items.map((item) => (
              <Card
                key={item.id}
                className="group flex flex-col justify-between rounded-2xl border border-congo-line bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg sm:p-8"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge
                      className={cn(
                        "h-auto rounded-md border px-3 py-1 text-[11px] font-bold tracking-wide uppercase",
                        toneClass[item.tone]
                      )}
                    >
                      {item.badge}
                    </Badge>
                    <span className="text-xs font-bold text-slate-400">N° {item.number}</span>
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs font-medium tracking-wide text-slate-400 uppercase">{item.kicker}</span>
                    <h3 className="text-xl leading-snug font-bold text-slate-900 transition-colors group-hover:text-congo">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-600">{item.text}</p>
                  </div>
                </div>
                <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                  <Link href={item.href} className="inline-flex items-center gap-1 text-sm font-bold text-congo transition-all hover:gap-2 hover:underline">
                    {item.cta} <span>→</span>
                  </Link>
                  <span className="text-xs text-slate-400">{item.meta}</span>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex items-start gap-4 rounded-2xl border border-gold-line bg-gold-soft p-6 shadow-sm sm:p-8">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gold text-gold-ink">
              <HugeiconsIcon icon={InformationCircleIcon} size={22} strokeWidth={2} />
            </div>
            <div className="space-y-1 text-sm leading-relaxed text-amber-900">
              <h4 className="text-base font-bold text-amber-950">Avis d'information institutionnel</h4>
              <p>
                Les articles présentés ci-dessus servent de démonstration pour le fonctionnement du portail
                officiel. Veuillez consulter régulièrement les annonces publiées par les ministères et
                organismes partenaires pour connaître les dates officielles d'ouverture et de clôture des
                registres.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
