"use client"

import { useState, useTransition } from "react"
import { addCity, renameCity, setCityActive } from "@/app/admin/actions"
import { MapPinIcon } from "@/components/site/icons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"

export type CityRow = { id: string; name: string; active: boolean; candidates: number }

type Result = { ok: true } | { ok: false; error: string }

/** Villes proposées sur le formulaire de candidature, gérées par l'administrateur. */
export function CitiesCard({ cities }: { cities: CityRow[] }) {
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

  function onAdd(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    run(null, () => addCity(name), "Ville ajoutée.", () => setName(""))
  }

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-200 p-5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gold text-gold-ink">
          <MapPinIcon size={18} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800">Villes disponibles</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Ces villes sont proposées sur le formulaire de candidature. Une ville désactivée disparaît du
            formulaire mais reste dans les filtres et l'historique.
          </p>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <form onSubmit={onAdd} className="flex flex-wrap gap-2">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom de la nouvelle ville"
            aria-label="Nom de la nouvelle ville"
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
          {cities.length === 0 && (
            <li className="p-4 text-sm text-slate-500">Aucune ville. Ajoutez-en une pour ouvrir les candidatures.</li>
          )}
          {cities.map((city) => {
            const isEditing = editing?.id === city.id
            const busy = pending && busyId === city.id
            return (
              <li key={city.id} className="flex flex-wrap items-center gap-3 p-3 sm:px-4">
                <div className="min-w-0 flex-1">
                  {isEditing ? (
                    <form
                      className="flex gap-2"
                      onSubmit={(e) => {
                        e.preventDefault()
                        run(city.id, () => renameCity(city.id, editing.value), "Ville renommée.", () =>
                          setEditing(null)
                        )
                      }}
                    >
                      <Input
                        autoFocus
                        value={editing.value}
                        onChange={(e) => setEditing({ id: city.id, value: e.target.value })}
                        aria-label={`Nouveau nom pour ${city.name}`}
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
                      <span className={city.active ? "font-semibold text-slate-800" : "font-semibold text-slate-400"}>
                        {city.name}
                      </span>
                      <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                        {city.candidates} candidature{city.candidates > 1 ? "s" : ""}
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
                      onClick={() => setEditing({ id: city.id, value: city.name })}
                      className="rounded-lg"
                    >
                      Renommer
                    </Button>
                    <label className="flex items-center gap-2 text-sm text-slate-600">
                      {busy ? <Spinner /> : null}
                      <Switch
                        checked={city.active}
                        disabled={pending}
                        onCheckedChange={(checked) =>
                          run(
                            city.id,
                            () => setCityActive(city.id, checked),
                            checked ? "Ville activée." : "Ville désactivée."
                          )
                        }
                        aria-label={`${city.name} : ${city.active ? "active" : "désactivée"}`}
                      />
                      {city.active ? "Active" : "Désactivée"}
                    </label>
                  </div>
                )}
              </li>
            )
          })}
        </ul>

        <p role="status" aria-live="polite" className={status?.error ? "min-h-5 text-sm text-flag-red" : "min-h-5 text-sm text-congo"}>
          {status?.text}
        </p>
      </div>
    </section>
  )
}
