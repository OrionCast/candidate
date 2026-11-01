import { cacheLife, cacheTag } from "next/cache"
import { ClockIcon } from "@/components/site/icons"
import { Button } from "@/components/ui/button"
import { createPublicClient } from "@/lib/supabase/public"

const DEFAULT_MESSAGE = "Les résultats ne sont pas encore publiés."

async function getPublication() {
  "use cache"
  cacheTag("publication")
  cacheLife("hours")

  const supabase = createPublicClient()
  const { data } = await supabase
    .from("publication")
    .select("content, pdf_file")
    .eq("id", 1)
    .maybeSingle()

  return {
    content: data?.content || DEFAULT_MESSAGE,
    pdfUrl: data?.pdf_file
      ? supabase.storage.from("results").getPublicUrl(data.pdf_file).data.publicUrl
      : null,
  }
}

/** Message et PDF des résultats, mis en cache jusqu'à la prochaine publication admin. */
export async function ResultsSection() {
  const { content, pdfUrl } = await getPublication()

  return (
    <section id="resultats" className="border-t border-congo-line bg-gradient-to-br from-[#e8f2ea] to-[#f5faf6] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-5">
        <div className="flex flex-col items-start gap-6 rounded-2xl border border-congo-line bg-white p-8 shadow-[0_4px_16px_rgba(7,91,61,0.06)] sm:flex-row sm:p-10">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gold to-gold-line text-gold-ink shadow-md">
            <ClockIcon size={26} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-2 text-[11px] font-bold tracking-[0.2em] text-congo uppercase">Suivi du programme</div>
            <h2 className="mb-3 text-2xl font-bold text-slate-800">Publication des résultats</h2>
            <p className="leading-relaxed whitespace-pre-line text-slate-600">{content}</p>
            {pdfUrl && (
              <Button asChild className="mt-4 h-11 rounded-lg px-5 font-semibold">
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                  Télécharger le PDF officiel
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
