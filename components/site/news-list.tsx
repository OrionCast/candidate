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
import type { NewsItem } from "@/lib/news"
import { cn } from "@/lib/utils"

const toneClass: Record<NewsItem["tone"], string> = {
  info: "border-congo-line bg-congo-soft text-congo",
  warning: "border-gold-line bg-gold-soft text-amber-800",
  danger: "border-red-200 bg-red-50 text-red-700",
}

const linkClass =
  "inline-flex items-center gap-1 text-sm font-bold text-congo transition-all hover:gap-2 hover:underline"

function NewsLink({ item }: { item: NewsItem }) {
  if (!item.linkHref || !item.linkLabel) return <span />
  const content = (
    <>
      {item.linkLabel} <span>→</span>
    </>
  )
  return item.linkHref.startsWith("/") ? (
    <Link href={item.linkHref} className={linkClass}>
      {content}
    </Link>
  ) : (
    <a href={item.linkHref} target="_blank" rel="noopener noreferrer" className={linkClass}>
      {content}
    </a>
  )
}

export function NewsList({ items: news }: { items: NewsItem[] }) {
  const [category, setCategory] = useState<string | null>(null)
  const [query, setQuery] = useState("")

  const categories = useMemo(() => [...new Set(news.map((item) => item.category))], [news])

  const items = useMemo(() => {
    const q = query.trim().toLowerCase()
    return news.filter(
      (item) =>
        (!category || item.category === category) &&
        (!q || [item.title, item.body, item.kicker].some((v) => v.toLowerCase().includes(q)))
    )
  }, [news, category, query])

  return (
    <>
      <section className="sticky top-24 z-20 border-b border-congo-line bg-white/95 py-5 shadow-sm backdrop-blur sm:top-28">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="flex flex-wrap items-center gap-2">
            {[null, ...categories].map((name) => (
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
              <h2 className="mt-1 font-display text-2xl font-bold text-slate-900 sm:text-3xl">Dernières publications</h2>
            </div>
            <span className="text-xs text-slate-500">
              {items.length} publication{items.length > 1 ? "s" : ""}
            </span>
          </div>

          {news.length === 0 && (
            <p className="py-12 text-center font-medium text-slate-500">Aucune publication pour le moment.</p>
          )}
          {news.length > 0 && items.length === 0 && (
            <p className="py-12 text-center font-medium text-slate-500">Aucune publication ne correspond à votre recherche.</p>
          )}

          <div className="grid gap-8 md:grid-cols-2">
            {items.map((item, index) => (
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
                    <span className="text-xs font-bold text-slate-400">N° {String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="space-y-2">
                    {item.kicker && (
                      <span className="text-xs font-medium tracking-wide text-slate-400 uppercase">{item.kicker}</span>
                    )}
                    <h3 className="text-xl leading-snug font-bold text-slate-900 transition-colors group-hover:text-congo">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed whitespace-pre-line text-slate-600">{item.body}</p>
                  </div>
                </div>
                <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                  <NewsLink item={item} />
                  {item.meta && <span className="text-xs text-slate-400">{item.meta}</span>}
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
                Consultez régulièrement les annonces publiées par les ministères et organismes partenaires pour connaître
                les dates officielles d'ouverture et de clôture des registres.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
