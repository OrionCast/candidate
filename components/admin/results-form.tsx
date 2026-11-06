"use client"

import { useState } from "react"
import { prepareResultsUpload, publishResults } from "@/app/admin/actions"
import { FlagIcon, SendIcon } from "@/components/site/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { createBrowserSupabase } from "@/lib/supabase/browser"
import { MAX_FILE_SIZE } from "@/lib/validation"

export function ResultsForm({ initialContent, hasPdf }: { initialContent: string; hasPdf: boolean }) {
  const [pending, setPending] = useState(false)
  const [status, setStatus] = useState<{ text: string; error: boolean } | null>(null)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const content = String(data.get("content") ?? "")
    const file = data.get("results")

    setPending(true)
    setStatus({ text: "Publication en cours…", error: false })

    try {
      let pdfPath: string | null = null

      if (file instanceof File && file.size > 0) {
        if (file.type !== "application/pdf" || file.size > MAX_FILE_SIZE) {
          return setStatus({ text: "Le document doit être un PDF de 30 Mo maximum.", error: true })
        }
        const prepared = await prepareResultsUpload({ type: file.type, size: file.size })
        if (!prepared.ok) return setStatus({ text: prepared.error, error: true })

        const { error } = await createBrowserSupabase()
          .storage.from("results")
          .uploadToSignedUrl(prepared.path, prepared.token, file, { contentType: file.type })
        if (error) return setStatus({ text: "L'envoi du PDF a échoué.", error: true })
        pdfPath = prepared.path
      }

      const result = await publishResults({ content, pdfPath })
      if (!result.ok) return setStatus({ text: result.error, error: true })

      form.querySelector<HTMLInputElement>('input[name="results"]')!.value = ""
      setStatus({ text: "Résultats publiés.", error: false })
    } catch {
      setStatus({ text: "Erreur lors de la publication.", error: true })
    } finally {
      setPending(false)
    }
  }

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-200 p-5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-flag-red text-white">
          <FlagIcon size={18} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800">Publication des résultats</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Ajoutez un message public et, si nécessaire, le PDF officiel des retenus.
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-5 p-5">
        <div className="space-y-2">
          <Label htmlFor="content" className="font-semibold text-slate-700">
            Message visible sur le site public
          </Label>
          <Textarea
            id="content"
            name="content"
            rows={4}
            maxLength={10000}
            defaultValue={initialContent}
            placeholder="Ex. Les résultats officiels sont disponibles. Consultez le document ci-dessous…"
            className="resize-y rounded-lg bg-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="results" className="font-semibold text-slate-700">
            Document officiel PDF <span className="font-normal text-slate-400">(facultatif, max. 30 Mo)</span>
          </Label>
          <Input
            id="results"
            name="results"
            type="file"
            accept="application/pdf"
            className="h-11 cursor-pointer rounded-lg bg-white p-0 pr-3 file:mr-3 file:h-full file:rounded-none file:bg-slate-100 file:px-4 file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
          />
          {hasPdf && <p className="text-xs text-slate-500">Un PDF est déjà publié. Choisir un fichier le remplacera.</p>}
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Button type="submit" disabled={pending} className="h-11 gap-2 rounded-lg px-5 font-semibold">
            {pending ? <Spinner /> : <SendIcon />} {pending ? "Publication…" : "Publier les résultats"}
          </Button>
          <span role="status" aria-live="polite" className={status?.error ? "text-sm text-flag-red" : "text-sm text-congo"}>
            {status?.text}
          </span>
        </div>
      </form>
    </section>
  )
}
