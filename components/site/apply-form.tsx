"use client"

import { useRef, useState } from "react"
import { finalizeApplication, prepareApplication } from "@/app/(site)/candidature/actions"
import { ArrowRightIcon, CheckIcon } from "@/components/site/icons"
import { FlagBar } from "@/components/site/flag-bar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createBrowserSupabase } from "@/lib/supabase/browser"
import {
  CITIES,
  DOCUMENT_KINDS,
  DOCUMENT_RULES,
  applicantSchema,
  checkFile,
  type DocumentKind,
} from "@/lib/validation"

const fileInputClass =
  "h-11 cursor-pointer rounded-lg border-dashed border-[#94c4a5] bg-[#f8fdf9] p-0 pr-3 text-slate-600 hover:border-congo hover:bg-[#f0f9f2] file:mr-3 file:h-full file:rounded-none file:bg-congo file:px-4 file:text-[13px] file:font-semibold file:text-white hover:file:bg-congo-dark"

const textInputClass = "h-11 rounded-lg bg-white"

function Required() {
  return <span className="text-flag-red">*</span>
}

export function ApplyForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [city, setCity] = useState("")
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reference, setReference] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    const data = new FormData(event.currentTarget)

    const applicant = applicantSchema.safeParse({
      fullName: data.get("fullName") ?? "",
      email: data.get("email") ?? "",
      phone: data.get("phone") ?? "",
      city,
      address: data.get("address") ?? "",
    })
    if (!applicant.success) return setError(applicant.error.issues[0]?.message ?? "Données invalides.")

    const files = {} as Record<DocumentKind, File>
    for (const kind of DOCUMENT_KINDS) {
      const file = data.get(kind)
      const problem = checkFile(kind, file instanceof File ? file : null)
      if (problem) return setError(problem)
      files[kind] = file as File
    }

    setPending(true)
    try {
      const meta = Object.fromEntries(
        DOCUMENT_KINDS.map((kind) => [kind, { name: files[kind].name, type: files[kind].type, size: files[kind].size }])
      ) as Record<DocumentKind, { name: string; type: string; size: number }>

      const prepared = await prepareApplication({ applicant: applicant.data, files: meta })
      if (!prepared.ok) return setError(prepared.error)

      const storage = createBrowserSupabase().storage.from("documents")
      const uploads = await Promise.all(
        DOCUMENT_KINDS.map((kind) =>
          storage.uploadToSignedUrl(prepared.uploads[kind].path, prepared.uploads[kind].token, files[kind], {
            contentType: files[kind].type,
          })
        )
      )
      if (uploads.some((upload) => upload.error)) {
        return setError("L'envoi d'un document a échoué. Vérifiez votre connexion et réessayez.")
      }

      const result = await finalizeApplication({
        ref: prepared.ref,
        applicant: applicant.data,
        paths: Object.fromEntries(DOCUMENT_KINDS.map((kind) => [kind, prepared.uploads[kind].path])),
      })
      if (!result.ok) return setError(result.error)

      setReference(result.reference)
      setCopied(false)
      setCity("")
      formRef.current?.reset()
    } catch {
      setError("Erreur lors de l'envoi. Veuillez réessayer.")
    } finally {
      setPending(false)
    }
  }

  async function copyReference() {
    if (!reference) return
    try {
      await navigator.clipboard.writeText(reference)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <>
      <section className="animate-fade-up overflow-hidden rounded-2xl border border-congo-line bg-white shadow-[0_4px_16px_rgba(7,91,61,0.05)]">
        <FlagBar className="h-1 bg-gradient-to-r from-congo via-congo-mid to-gold" />
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e2ede5] bg-gradient-to-b from-[#f8fdf9] to-white p-6 sm:p-8">
          <div>
            <div className="mb-1 text-[11px] font-bold tracking-[0.2em] text-congo uppercase">Formulaire en ligne</div>
            <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">Vos informations</h2>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-flag-red">
            * Obligatoire
          </span>
        </div>

        <form ref={formRef} onSubmit={onSubmit} className="space-y-5 p-6 sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="font-semibold text-slate-700">
                Nom complet <Required />
              </Label>
              <Input id="fullName" name="fullName" required maxLength={140} autoComplete="name" placeholder="Ex. Ryan Emmanuel" className={textInputClass} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="font-semibold text-slate-700">
                Adresse e-mail <span className="text-xs font-normal text-slate-400">(facultatif)</span>
              </Label>
              <Input id="email" name="email" type="email" maxLength={180} autoComplete="email" placeholder="vous@exemple.com" className={textInputClass} />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone" className="font-semibold text-slate-700">
                Numéro de téléphone <Required />
              </Label>
              <Input id="phone" name="phone" required maxLength={30} autoComplete="tel" placeholder="Ex. 06 123 45 67" className={textInputClass} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city" className="font-semibold text-slate-700">
                Ville <Required />
              </Label>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger id="city" className="h-11 w-full rounded-lg bg-white">
                  <SelectValue placeholder="— Sélectionnez une ville —" />
                </SelectTrigger>
                <SelectContent>
                  {CITIES.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="font-semibold text-slate-700">
              Adresse <Required />
            </Label>
            <Input id="address" name="address" required maxLength={255} autoComplete="street-address" placeholder="Ex. 12 rue de la Paix, Bacongo" className={textInputClass} />
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-congo-line to-transparent" />

          <div className="grid gap-5 sm:grid-cols-2">
            {DOCUMENT_KINDS.map((kind) => (
              <div key={kind} className="space-y-2">
                <Label htmlFor={kind} className="font-semibold text-slate-700">
                  {DOCUMENT_RULES[kind].label} <Required />
                </Label>
                <Input
                  id={kind}
                  name={kind}
                  type="file"
                  required
                  accept={DOCUMENT_RULES[kind].mimes.join(",")}
                  className={fileInputClass}
                />
                <small className="block text-xs text-congo">{DOCUMENT_RULES[kind].hint}</small>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-3 rounded-lg border border-[#b8dfc2] bg-[#eaf7ee] p-4">
            <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-congo text-xs font-bold text-white" aria-hidden="true">
              i
            </span>
            <p className="text-sm leading-relaxed text-slate-700">
              Vos documents sont transmis à l'administration pour le traitement de votre dossier. N'envoyez que
              les pièces demandées.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Button
              type="submit"
              disabled={pending}
              size="lg"
              className="h-12 gap-2 rounded-lg bg-gradient-to-br from-congo to-congo-mid px-6 text-sm font-semibold text-white shadow-md hover:-translate-y-0.5 hover:shadow-lg"
            >
              {pending ? "Envoi en cours…" : "Envoyer ma candidature"}
              {!pending && <ArrowRightIcon />}
            </Button>
            <span role="status" aria-live="polite" className="text-sm font-medium text-flag-red">
              {error}
            </span>
          </div>
        </form>
      </section>

      <Dialog open={reference !== null} onOpenChange={(open) => !open && setReference(null)}>
        <DialogContent className="rounded-2xl p-8 sm:max-w-md">
          <FlagBar className="absolute top-0 left-0 h-1.5 w-full rounded-t-2xl" />
          <DialogHeader className="items-center text-center">
            <div className="mx-auto mt-2 mb-2 flex size-16 items-center justify-center rounded-full bg-green-100 text-congo shadow-md">
              <CheckIcon size={30} />
            </div>
            <DialogTitle className="text-xl font-bold text-slate-800">Candidature envoyée</DialogTitle>
            <DialogDescription className="leading-relaxed">
              Votre dossier a été transmis. Conservez soigneusement votre code de référence.
            </DialogDescription>
          </DialogHeader>
          <p className="rounded-lg border border-[#b8dfc2] bg-[#eaf7ee] px-4 py-3 text-center font-mono text-lg font-bold text-congo">
            {reference}
          </p>
          <Button onClick={copyReference} className="h-11 w-full rounded-lg bg-gold font-bold text-gold-ink hover:bg-gold/90">
            {copied ? "Code copié ✓" : "Copier le code"}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
