"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Add01Icon, UserIcon } from "@hugeicons/core-free-icons"
import { useEffect, useRef, useState } from "react"
import { finalizeApplication, prepareApplication } from "@/app/(site)/candidature/actions"
import { ArrowRightIcon, CheckIcon } from "@/components/site/icons"
import { FlagBar } from "@/components/site/flag-bar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { createBrowserSupabase } from "@/lib/supabase/browser"
import {
  BAC_TYPES,
  BAC_YEARS,
  DOCUMENT_KINDS,
  DOCUMENT_RULES,
  REQUIRED_DOCUMENTS,
  SPECIALTIES,
  applicantSchema,
  checkFile,
  type DocumentKind,
} from "@/lib/validation"

const fileInputClass =
  "h-11 cursor-pointer rounded-lg border-dashed border-[#94c4a5] bg-[#f8fdf9] p-0 pr-3 text-slate-600 hover:border-congo hover:bg-[#f0f9f2] file:mr-3 file:h-full file:rounded-none file:bg-congo file:px-4 file:text-[13px] file:font-semibold file:text-white hover:file:bg-congo-dark"

const textInputClass = "h-11 rounded-lg bg-white"
const selectClass = "h-11 w-full rounded-lg bg-white"

function Required() {
  return <span className="text-flag-red">*</span>
}

type SelectFieldProps = {
  id: string
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  options: readonly string[]
}

function SelectField({ id, label, placeholder, value, onChange, options }: SelectFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="font-semibold text-slate-700">
        {label} <Required />
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} className={selectClass}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export function ApplyForm({ cities }: { cities: string[] }) {
  const formRef = useRef<HTMLFormElement>(null)
  const photoInputRef = useRef<HTMLInputElement>(null)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [city, setCity] = useState("")
  const [bacType, setBacType] = useState("")
  const [bacYear, setBacYear] = useState("")
  const [specialty, setSpecialty] = useState("")
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reference, setReference] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // Libère l'aperçu de la photo quand il change ou quand le composant disparaît.
  useEffect(() => {
    return () => {
      if (photoUrl) URL.revokeObjectURL(photoUrl)
    }
  }, [photoUrl])

  function onPhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null
    setError(null)
    if (!file) return setPhotoUrl(null)

    const problem = checkFile("photo", file)
    if (problem) {
      event.target.value = ""
      setPhotoUrl(null)
      return setError(problem)
    }
    setPhotoUrl(URL.createObjectURL(file))
  }

  function resetForm() {
    formRef.current?.reset()
    setPhotoUrl(null)
    setCity("")
    setBacType("")
    setBacYear("")
    setSpecialty("")
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    const data = new FormData(event.currentTarget)

    const applicant = applicantSchema.safeParse({
      fullName: data.get("fullName") ?? "",
      email: data.get("email") ?? "",
      dateOfBirth: data.get("dateOfBirth") ?? "",
      placeOfBirth: data.get("placeOfBirth") ?? "",
      bacType,
      bacYear,
      specialty,
      phone: data.get("phone") ?? "",
      city,
      address: data.get("address") ?? "",
    })
    if (!applicant.success) return setError(applicant.error.issues[0]?.message ?? "Données invalides.")

    const files: Partial<Record<DocumentKind, File>> = {}
    for (const kind of DOCUMENT_KINDS) {
      const entry = data.get(kind)
      const file = entry instanceof File && entry.size > 0 ? entry : null
      const problem = checkFile(kind, file)
      if (problem) return setError(problem)
      if (file) files[kind] = file
    }

    setPending(true)
    try {
      const meta = Object.fromEntries(
        DOCUMENT_KINDS.map((kind) => {
          const file = files[kind]
          return [kind, file ? { name: file.name, type: file.type, size: file.size } : null]
        })
      )

      const prepared = await prepareApplication({ applicant: applicant.data, files: meta })
      if (!prepared.ok) return setError(prepared.error)

      const storage = createBrowserSupabase().storage.from("documents")
      const uploads = await Promise.all(
        DOCUMENT_KINDS.flatMap((kind) => {
          const file = files[kind]
          const upload = prepared.uploads[kind]
          if (!file || !upload) return []
          return [storage.uploadToSignedUrl(upload.path, upload.token, file, { contentType: file.type })]
        })
      )
      if (uploads.some((upload) => upload.error)) {
        return setError("L'envoi d'un document a échoué. Vérifiez votre connexion et réessayez.")
      }

      const result = await finalizeApplication({
        ref: prepared.ref,
        applicant: applicant.data,
        paths: Object.fromEntries(DOCUMENT_KINDS.map((kind) => [kind, prepared.uploads[kind]?.path ?? null])),
      })
      if (!result.ok) return setError(result.error)

      setReference(result.reference)
      setCopied(false)
      resetForm()
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
      <section className="animate-fade-up overflow-hidden rounded-2xl border border-congo-line bg-white shadow-[0_4px_16px_rgba(8,116,71,0.05)]">
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
          {/* Photo de profil (facultative) */}
          <div className="flex flex-col items-center gap-3">
            <span className="block text-sm font-semibold text-slate-700">
              Photo de profil <span className="text-xs font-normal text-slate-400">(facultatif)</span>
            </span>
            <label htmlFor="photo" className="group relative shrink-0 cursor-pointer">
              <div
                className={`flex size-28 items-center justify-center overflow-hidden rounded-full border-2 bg-[#f8fdf9] transition-all duration-200 group-hover:scale-105 ${
                  photoUrl ? "border-solid border-[#94c4a5]" : "border-dashed border-[#94c4a5]"
                }`}
              >
                {photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photoUrl} alt="Aperçu de la photo" className="size-full object-cover" />
                ) : (
                  <HugeiconsIcon icon={UserIcon} size={36} strokeWidth={1.6} className="text-congo-mid" />
                )}
              </div>
              <span className="absolute right-1 bottom-1 flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-congo to-congo-mid text-white shadow-md transition-transform group-hover:scale-110">
                <HugeiconsIcon icon={Add01Icon} size={16} strokeWidth={2.5} />
              </span>
            </label>
            <input
              ref={photoInputRef}
              id="photo"
              name="photo"
              type="file"
              accept=".jpg,.jpeg,.png,image/jpeg,image/png"
              className="sr-only"
              onChange={onPhotoChange}
            />
            <small className="text-xs text-congo">{DOCUMENT_RULES.photo.hint}</small>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-congo-line to-transparent" />

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
              <Label htmlFor="dateOfBirth" className="font-semibold text-slate-700">
                Date de naissance <Required />
              </Label>
              <Input id="dateOfBirth" name="dateOfBirth" type="date" required autoComplete="bday" className={textInputClass} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="placeOfBirth" className="font-semibold text-slate-700">
                Lieu de naissance <Required />
              </Label>
              <Input id="placeOfBirth" name="placeOfBirth" required maxLength={120} placeholder="Ex. Brazzaville" className={textInputClass} />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <SelectField id="bacType" label="Type de BAC" placeholder="— Sélectionnez un BAC —" value={bacType} onChange={setBacType} options={BAC_TYPES} />
            <SelectField id="bacYear" label="Année d'obtention" placeholder="— Sélectionnez une année —" value={bacYear} onChange={setBacYear} options={BAC_YEARS} />
          </div>

          <SelectField id="specialty" label="Spécialité" placeholder="— Sélectionnez une spécialité —" value={specialty} onChange={setSpecialty} options={SPECIALTIES} />

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone" className="font-semibold text-slate-700">
                Numéro de téléphone <Required />
              </Label>
              <Input id="phone" name="phone" required maxLength={30} autoComplete="tel" placeholder="Ex. 06 123 45 67" className={textInputClass} />
            </div>
            <SelectField id="city" label="Ville" placeholder="— Sélectionnez une ville —" value={city} onChange={setCity} options={cities} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="font-semibold text-slate-700">
              Adresse <Required />
            </Label>
            <Input id="address" name="address" required maxLength={255} autoComplete="street-address" placeholder="Ex. 12 rue de la Paix, Bacongo" className={textInputClass} />
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-congo-line to-transparent" />

          <div className="grid gap-5 sm:grid-cols-2">
            {REQUIRED_DOCUMENTS.map((kind) => (
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
              {pending ? (
                <>
                  <Spinner /> Envoi en cours…
                </>
              ) : (
                <>
                  Envoyer ma candidature <ArrowRightIcon />
                </>
              )}
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
