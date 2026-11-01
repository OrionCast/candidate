import { Skeleton } from "@/components/ui/skeleton"

/** Squelette du tableau de bord, affiché pendant la lecture des candidatures. */
export function DashboardSkeleton() {
  return (
    <div role="status" aria-label="Chargement du tableau de bord" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-40 rounded-lg" />
          <Skeleton className="h-10 w-36 rounded-lg" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {[0, 1].map((card) => (
          <div key={card} className="flex items-center gap-5 rounded-xl border border-slate-200 bg-white p-6">
            <Skeleton className="size-14 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="space-y-2 border-b border-slate-200 p-5">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="space-y-3 p-5">
          {[0, 1, 2, 3, 4].map((row) => (
            <Skeleton key={row} className="h-10 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  )
}
