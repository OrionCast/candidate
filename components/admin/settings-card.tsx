"use client"

import { useState, useTransition } from "react"
import { updateSettings } from "@/app/admin/content-actions"
import { ClockIcon } from "@/components/site/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { applicationState, toBrazzavilleDate, type SiteSettings } from "@/lib/site-settings"

const STATE_TEXT = {
  open: { text: "Le formulaire est ouvert.", tone: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  not_yet: { text: "Les candidatures ne sont pas encore ouvertes.", tone: "bg-amber-50 text-amber-900 border-amber-200" },
  closed: { text: "Les candidatures sont closes.", tone: "bg-red-50 text-red-800 border-red-200" },
} as const

/** Période de l'appel à candidature, places et coordonnées affichées sur le site. */
export function SettingsCard({ settings, now }: { settings: SiteSettings; now: number }) {
  const [pending, startTransition] = useTransition()
  const [status, setStatus] = useState<{ text: string; error: boolean } | null>(null)
  const [enforce, setEnforce] = useState(settings.enforceWindow)

  const state = STATE_TEXT[applicationState(settings, now)]

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setStatus(null)

    startTransition(async () => {
      try {
        const result = await updateSettings({
          opensOn: String(data.get("opensOn") ?? ""),
          closesOn: String(data.get("closesOn") ?? ""),
          enforceWindow: enforce,
          placesCount: Number(data.get("placesCount")),
          phonePrimary: String(data.get("phonePrimary") ?? ""),
          phoneSecondary: String(data.get("phoneSecondary") ?? ""),
          contactEmail: String(data.get("contactEmail") ?? ""),
          address: String(data.get("address") ?? ""),
        })
        setStatus(result.ok ? { text: "Réglages enregistrés.", error: false } : { text: result.error, error: true })
      } catch {
        setStatus({ text: "Une erreur est survenue. Réessayez.", error: true })
      }
    })
  }

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-200 p-5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-congo text-white">
          <ClockIcon size={18} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800">Période d'appel et coordonnées</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Ces informations sont affichées sur l'accueil, le pied de page et la page de contact.
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6 p-5">
        <div className={`rounded-lg border px-4 py-3 text-sm font-medium ${state.tone}`}>
          {state.text}
          {!settings.enforceWindow && (
            <span className="font-normal"> La période est affichée à titre d'information : elle n'est pas imposée.</span>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="opensOn" className="font-semibold text-slate-700">
              Début de l'appel
            </Label>
            <Input id="opensOn" name="opensOn" type="date" defaultValue={toBrazzavilleDate(settings.applyOpensAt)} className="h-10 rounded-lg bg-white" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="closesOn" className="font-semibold text-slate-700">
              Fin de l'appel (inclus)
            </Label>
            <Input id="closesOn" name="closesOn" type="date" defaultValue={toBrazzavilleDate(settings.applyClosesAt)} className="h-10 rounded-lg bg-white" />
          </div>
        </div>

        <label className="flex items-start gap-3 rounded-lg border border-slate-200 p-4">
          <Switch checked={enforce} onCheckedChange={setEnforce} aria-label="Fermer le formulaire hors période" className="mt-0.5" />
          <span className="text-sm">
            <span className="block font-semibold text-slate-800">Fermer le formulaire en dehors de la période</span>
            <span className="text-slate-500">
              Quand c'est activé, la page de candidature affiche « pas encore ouvertes » ou « closes » et le serveur refuse
              les dépôts hors période (fuseau de Brazzaville).
            </span>
          </span>
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="placesCount" className="font-semibold text-slate-700">
              Nombre de places
            </Label>
            <Input id="placesCount" name="placesCount" type="number" min={1} defaultValue={settings.placesCount} required className="h-10 rounded-lg bg-white" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactEmail" className="font-semibold text-slate-700">
              E-mail de contact
            </Label>
            <Input id="contactEmail" name="contactEmail" type="email" defaultValue={settings.contactEmail} required maxLength={180} className="h-10 rounded-lg bg-white" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phonePrimary" className="font-semibold text-slate-700">
              Téléphone principal
            </Label>
            <Input id="phonePrimary" name="phonePrimary" defaultValue={settings.phonePrimary} maxLength={40} className="h-10 rounded-lg bg-white" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneSecondary" className="font-semibold text-slate-700">
              Téléphone secondaire
            </Label>
            <Input id="phoneSecondary" name="phoneSecondary" defaultValue={settings.phoneSecondary} maxLength={40} className="h-10 rounded-lg bg-white" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address" className="font-semibold text-slate-700">
            Adresse
          </Label>
          <Input id="address" name="address" defaultValue={settings.address} required maxLength={255} className="h-10 rounded-lg bg-white" />
        </div>

        <p className="text-xs text-slate-400">
          Le nombre de places est repris dans les repères chiffrés de l'accueil ; les phrases rédigées gardent leur texte.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={pending} className="h-11 gap-2 rounded-lg px-5 font-semibold">
            {pending && <Spinner />} Enregistrer les réglages
          </Button>
          <span role="status" aria-live="polite" className={status?.error ? "text-sm text-flag-red" : "text-sm text-congo"}>
            {status?.text}
          </span>
        </div>
      </form>
    </section>
  )
}
