import { Skeleton } from "@/components/ui/skeleton"

/** Emplacement du formulaire de candidature pendant le chargement des villes. */
export function ApplyFormSkeleton() {
  return (
    <div
      role="status"
      aria-label="Chargement du formulaire"
      className="overflow-hidden rounded-2xl border border-congo-line bg-white"
    >
      <div className="space-y-3 border-b border-[#e2ede5] p-6 sm:p-8">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-7 w-56" />
      </div>
      <div className="space-y-5 p-6 sm:p-8">
        {[0, 1, 2].map((row) => (
          <div key={row} className="grid gap-5 sm:grid-cols-2">
            <Skeleton className="h-11" />
            <Skeleton className="h-11" />
          </div>
        ))}
        <Skeleton className="h-12 w-56" />
      </div>
    </div>
  )
}

/** Emplacement de la section « Publication des résultats ». */
export function ResultsSkeleton() {
  return (
    <section
      role="status"
      aria-label="Chargement des résultats"
      className="border-t border-congo-line bg-gradient-to-br from-[#e8f2ea] to-[#f5faf6] py-12 sm:py-16"
    >
      <div className="mx-auto max-w-7xl px-5">
        <div className="flex items-start gap-6 rounded-2xl border border-congo-line bg-white p-8 sm:p-10">
          <Skeleton className="size-16 shrink-0 rounded-2xl" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-4 w-full max-w-md" />
          </div>
        </div>
      </div>
    </section>
  )
}
