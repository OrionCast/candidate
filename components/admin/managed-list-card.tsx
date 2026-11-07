"use client"

import { useState, useTransition, type ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"

export type ManagedItem = { id: string; name: string; active: boolean; count: number }

type Result = { ok: true } | { ok: false; error: string }

type Props = {
  title: string
  description: string
  icon: ReactNode
  iconTone: string
  items: ManagedItem[]
  /** Nom au singulier compté à côté de chaque valeur, par exemple « candidature ». */
  countNoun: string
  placeholder: string
  emptyText: string
  renameNote: string
  actions: {
    add: (name: string) => Promise<Result>
    rename: (id: string, name: string) => Promise<Result>
    setActive: (id: string, active: boolean) => Promise<Result>
  }
}

/** Liste de valeurs gérée par l'administrateur (villes, spécialités) : ajout, renommage, activation. */
export function ManagedListCard({
  title,
  description,
  icon,
  iconTone,
  items,
  countNoun,
  placeholder,
  emptyText,
  renameNote,
  actions,
}: Props) {
  const [pending, startTransition] = useTransition()
  const [busyId, setBusyId] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [editing, setEditing] = useState<{ id: string; value: string } | null>(null)
  const [status, setStatus] = useState<{ text: string; error: boolean } | null>(null)

  function run(id: string | null, action: () => Promise<Result>, success: string, done?: () => void) {
    setStatus(null)
    setBusyId(id)
    startTransition(async () => {
      try {
        const result = await action()
        if (result.ok) {
          setStatus({ text: success, error: false })
          done?.()
        } else {
          setStatus({ text: result.error, error: true })
        }
      } catch {
        setStatus({ text: "Une erreur est survenue. Réessayez.", error: true })
      } finally {
        setBusyId(null)
      }
    })
  }

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-200 p-5">
        <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${iconTone}`}>{icon}</div>
        <div>
          <h2 className="text-lg font-bold text-slate-800">{title}</h2>
          <p className="mt-0.5 text-sm text-slate-500">{description}</p>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <form
          onSubmit={(event) => {
            event.preventDefault()
            run(null, () => actions.add(name), "Ajouté.", () => setName(""))
          }}
          className="flex flex-wrap gap-2"
        >
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={placeholder}
            aria-label={placeholder}
            maxLength={100}
            required
            className="h-10 flex-1 rounded-lg bg-white sm:max-w-sm"
          />
          <Button type="submit" disabled={pending} className="h-10 gap-2 rounded-lg px-4 font-semibold">
            {pending && busyId === null ? <Spinner /> : null}
            Ajouter
          </Button>
        </form>

        <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200">
          {items.length === 0 && <li className="p-4 text-sm text-slate-500">{emptyText}</li>}
          {items.map((item) => {
            const isEditing = editing?.id === item.id
            const busy = pending && busyId === item.id
            return (
              <li key={item.id} className="flex flex-wrap items-center gap-3 p-3 sm:px-4">
                <div className="min-w-0 flex-1">
                  {isEditing ? (
                    <form
                      className="flex gap-2"
                      onSubmit={(e) => {
                        e.preventDefault()
                        run(item.id, () => actions.rename(item.id, editing.value), "Renommé.", () => setEditing(null))
                      }}
                    >
                      <Input
                        autoFocus
                        value={editing.value}
                        onChange={(e) => setEditing({ id: item.id, value: e.target.value })}
                        aria-label={`Nouveau nom pour ${item.name}`}
                        maxLength={100}
                        required
                        className="h-9 rounded-lg bg-white"
                      />
                      <Button type="submit" size="sm" disabled={pending} className="rounded-lg">
                        Enregistrer
                      </Button>
                      <Button type="button" size="sm" variant="ghost" onClick={() => setEditing(null)} className="rounded-lg">
                        Annuler
                      </Button>
                    </form>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={item.active ? "font-semibold text-slate-800" : "font-semibold text-slate-400"}>
                        {item.name}
                      </span>
                      <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                        {item.count} {item.count > 1 ? `${countNoun}s` : countNoun}
                      </Badge>
                    </div>
                  )}
                </div>

                {!isEditing && (
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      disabled={pending}
                      onClick={() => setEditing({ id: item.id, value: item.name })}
                      className="rounded-lg"
                    >
                      Renommer
                    </Button>
                    <label className="flex items-center gap-2 text-sm text-slate-600">
                      {busy ? <Spinner /> : null}
                      <Switch
                        checked={item.active}
                        disabled={pending}
                        onCheckedChange={(checked) =>
                          run(item.id, () => actions.setActive(item.id, checked), checked ? "Activé." : "Désactivé.")
                        }
                        aria-label={`${item.name} : ${item.active ? "actif" : "désactivé"}`}
                      />
                      {item.active ? "Active" : "Désactivée"}
                    </label>
                  </div>
                )}
              </li>
            )
          })}
        </ul>

        <p className="text-xs text-slate-400">{renameNote}</p>
        <p role="status" aria-live="polite" className={status?.error ? "min-h-5 text-sm text-flag-red" : "min-h-5 text-sm text-congo"}>
          {status?.text}
        </p>
      </div>
    </section>
  )
}
