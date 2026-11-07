"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon, ArrowRight01Icon, Image01Icon, Maximize01Icon } from "@hugeicons/core-free-icons"
import Image from "next/image"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import {
  CATEGORY_LABEL,
  GALLERY_CATEGORIES,
  resizedSrc,
  type GalleryCategory,
  type GalleryEntry,
} from "@/lib/gallery"
import { cn } from "@/lib/utils"

/** Galerie filtrable avec visionneuse plein écran (flèches du clavier prises en charge). */
export function GalleryGrid({ photos }: { photos: GalleryEntry[] }) {
  const [category, setCategory] = useState<GalleryCategory | null>(null)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const items = useMemo(
    () => photos.filter((item) => !category || item.category === category),
    [photos, category]
  )

  const current = openIndex !== null ? items[openIndex] : null
  const move = (step: number) =>
    setOpenIndex((index) => (index === null ? null : (index + step + items.length) % items.length))

  return (
    <>
      <div className="mb-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {[{ id: null, label: "Toutes les photos" }, ...GALLERY_CATEGORIES].map((filter) => (
          <Button
            key={filter.id ?? "all"}
            type="button"
            variant={category === filter.id ? "default" : "outline"}
            onClick={() => setCategory(filter.id)}
            className={cn(
              "h-10 rounded-xl px-5 text-xs font-bold transition-all duration-300 hover:-translate-y-0.5 sm:text-sm",
              category === filter.id
                ? "bg-gradient-to-br from-congo to-congo-dark shadow-lg shadow-congo/25"
                : "bg-white text-slate-600"
            )}
          >
            {filter.label}
          </Button>
        ))}
      </div>

      <div className="grid auto-rows-[200px] grid-cols-2 gap-4 sm:auto-rows-[220px] sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
        {items.map((item, index) => (
          <figure
            key={item.id}
            className={cn(
              "group animate-fade-up relative isolate overflow-hidden rounded-[1.25rem] bg-slate-200 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_48px_rgba(5,55,38,.18)]",
              item.size === "wide" && "col-span-2",
              item.size === "tall" && "row-span-2"
            )}
            style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(index)}
              aria-label={`Agrandir : ${item.title}`}
              className="absolute inset-0 z-10 cursor-pointer rounded-[1.25rem]"
            />
            <Image
              src={resizedSrc(item.src, 800, 70)}
              alt={item.title}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <span className="absolute top-4 right-4 flex size-9 scale-75 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
              <HugeiconsIcon icon={Maximize01Icon} size={16} strokeWidth={2} />
            </span>
            <figcaption className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-b from-transparent from-35% to-congo-forest/85 p-5 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span className="mb-1 text-[10px] font-bold tracking-wider text-yellow-300 uppercase">
                {CATEGORY_LABEL[item.category]}
              </span>
              <h3 className="text-base leading-tight font-bold">{item.title}</h3>
              <p className="mt-1 text-xs text-white/75">{item.place}</p>
            </figcaption>
          </figure>
        ))}
      </div>

      {items.length === 0 && (
        <div className="py-16 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <HugeiconsIcon icon={Image01Icon} size={28} strokeWidth={1.6} />
          </div>
          <p className="text-slate-500">Aucune photo ne correspond à ce filtre.</p>
        </div>
      )}

      <Dialog open={current !== null} onOpenChange={(open) => !open && setOpenIndex(null)}>
        <DialogContent
          className="max-w-5xl gap-3 rounded-2xl border-0 bg-slate-950/95 p-3 text-white ring-0 sm:max-w-5xl"
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") move(-1)
            if (event.key === "ArrowRight") move(1)
          }}
        >
          {current && (
            <>
              <DialogTitle className="sr-only">{current.title}</DialogTitle>
              <DialogDescription className="sr-only">{current.place}</DialogDescription>
              <div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl bg-black">
                <Image
                  src={resizedSrc(current.src, 1600, 80)}
                  alt={current.title}
                  fill
                  sizes="(min-width: 1024px) 64rem, 100vw"
                  className="object-contain"
                  priority
                />
              </div>
              <p className="px-2 pb-1 text-center text-sm text-white/85">
                {current.title} <span className="text-white/50">· {current.place}</span>
              </p>
              <Button
                type="button"
                variant="ghost"
                size="icon-lg"
                onClick={() => move(-1)}
                aria-label="Photo précédente"
                className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-white/10 text-white hover:bg-yellow-400/25 hover:text-white"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} size={22} strokeWidth={2} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-lg"
                onClick={() => move(1)}
                aria-label="Photo suivante"
                className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-white/10 text-white hover:bg-yellow-400/25 hover:text-white"
              >
                <HugeiconsIcon icon={ArrowRight01Icon} size={22} strokeWidth={2} />
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
