"use client"

import { useState } from "react"
import { ArrowRightIcon } from "@/components/site/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const SUBJECTS = [
  "Question sur la candidature",
  "Problème technique",
  "Documents à fournir",
  "Autre demande",
]

// Adresse officielle du programme PATN, modifiable via NEXT_PUBLIC_CONTACT_EMAIL.
const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "formationpatn@cciamb-cnia.cg"

function Required() {
  return <span className="text-flag-red">*</span>
}

/** Prépare un e-mail dans la messagerie du visiteur (comme le projet d'origine). */
export function ContactForm() {
  const [subject, setSubject] = useState("")
  const [status, setStatus] = useState<{ text: string; error: boolean } | null>(null)

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)

    if (!subject) return setStatus({ text: "Veuillez choisir un objet.", error: true })
    if (!CONTACT_EMAIL) {
      return setStatus({
        text: "L'adresse de contact officielle n'est pas encore configurée.",
        error: true,
      })
    }

    const body = `${data.get("message")}\n\n— ${data.get("name")} (${data.get("email")})`
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setStatus({ text: "Votre messagerie va s'ouvrir avec le message prêt à envoyer.", error: false })
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 p-6 sm:p-8">
      <p className="text-sm text-slate-500 italic">
        Les coordonnées officielles devront être ajoutées par l'organisme gestionnaire avant la mise en production.
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name" className="font-semibold text-slate-700">
            Nom complet <Required />
          </Label>
          <Input id="name" name="name" required maxLength={120} autoComplete="name" placeholder="Votre nom" className="h-11 rounded-lg bg-white" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="font-semibold text-slate-700">
            Adresse e-mail <Required />
          </Label>
          <Input id="email" name="email" type="email" required maxLength={180} autoComplete="email" placeholder="vous@exemple.com" className="h-11 rounded-lg bg-white" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject" className="font-semibold text-slate-700">
          Objet <Required />
        </Label>
        <Select value={subject} onValueChange={setSubject}>
          <SelectTrigger id="subject" className="h-11 w-full rounded-lg bg-white">
            <SelectValue placeholder="Choisissez un sujet" />
          </SelectTrigger>
          <SelectContent>
            {SUBJECTS.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="font-semibold text-slate-700">
          Message <Required />
        </Label>
        <Textarea id="message" name="message" required minLength={10} maxLength={3000} rows={6} placeholder="Décrivez votre demande…" className="resize-y rounded-lg bg-white" />
      </div>

      <div className="flex items-start gap-3 rounded-lg border border-[#b8dfc2] bg-[#eaf7ee] p-4">
        <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-congo text-xs font-bold text-white" aria-hidden="true">
          i
        </span>
        <p className="text-sm leading-relaxed text-slate-700">
          Ce formulaire prépare un e-mail dans votre application de messagerie ; il ne transmet pas directement
          les données à une base de données.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <Button
          type="submit"
          size="lg"
          className="h-12 gap-2 rounded-lg bg-gradient-to-br from-congo to-congo-mid px-6 text-sm font-semibold text-white shadow-md hover:-translate-y-0.5 hover:shadow-lg"
        >
          Préparer mon message <ArrowRightIcon />
        </Button>
        <span role="status" aria-live="polite" className={status?.error ? "text-sm font-medium text-flag-red" : "text-sm font-medium text-congo"}>
          {status?.text}
        </span>
      </div>
    </form>
  )
}
