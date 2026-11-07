"use client"

import { useState, useTransition } from "react"
import { createAdminAccount, revokeAdminAccount } from "@/app/admin/content-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import type { AdminAccount } from "@/lib/admins"

/** Comptes administrateurs : création avec mot de passe initial, et retrait des droits. */
export function AdminsCard({ admins, currentUserId }: { admins: AdminAccount[]; currentUserId: string }) {
  const [pending, startTransition] = useTransition()
  const [busyId, setBusyId] = useState<string | null>(null)
  const [status, setStatus] = useState<{ text: string; error: boolean } | null>(null)

  function onCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    setStatus(null)
    setBusyId(null)

    startTransition(async () => {
      try {
        const result = await createAdminAccount({ email: String(data.get("email") ?? ""), password: String(data.get("password") ?? "") })
        if (result.ok) {
          form.reset()
          setStatus({ text: "Compte administrateur créé. Communiquez-lui son mot de passe de façon sûre.", error: false })
        } else {
          setStatus({ text: result.error, error: true })
        }
      } catch {
        setStatus({ text: "Une erreur est survenue. Réessayez.", error: true })
      }
    })
  }

  function onRevoke(admin: AdminAccount) {
    if (!confirm(`Retirer les droits d'administration de ${admin.email} ?`)) return
    setStatus(null)
    setBusyId(admin.id)
    startTransition(async () => {
      try {
        const result = await revokeAdminAccount(admin.id)
        setStatus(result.ok ? { text: "Droits retirés.", error: false } : { text: result.error, error: true })
      } catch {
        setStatus({ text: "Une erreur est survenue. Réessayez.", error: true })
      } finally {
        setBusyId(null)
      }
    })
  }

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-5">
        <h2 className="text-lg font-bold text-slate-800">Administrateurs</h2>
        <p className="mt-0.5 text-sm text-slate-500">Les personnes qui peuvent se connecter à cette interface.</p>
      </div>

      <div className="space-y-5 p-5">
        <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200">
          {admins.map((admin) => (
            <li key={admin.id} className="flex flex-wrap items-center justify-between gap-3 p-3 sm:px-4">
              <span className="font-semibold text-slate-800">
                {admin.email}
                {admin.id === currentUserId && <span className="ml-2 text-xs font-normal text-slate-400">(vous)</span>}
              </span>
              {admin.id !== currentUserId && (
                <Button type="button" size="sm" variant="destructive" disabled={pending} onClick={() => onRevoke(admin)} className="gap-2 rounded-lg">
                  {pending && busyId === admin.id ? <Spinner /> : null} Retirer les droits
                </Button>
              )}
            </li>
          ))}
        </ul>

        <form onSubmit={onCreate} className="grid gap-4 rounded-lg border border-dashed border-congo-line bg-[#f8fdf9] p-4 sm:grid-cols-2">
          <p className="text-sm font-semibold text-slate-800 sm:col-span-2">Ajouter un administrateur</p>
          <div className="space-y-2">
            <Label htmlFor="admin-email" className="font-semibold text-slate-700">Adresse e-mail</Label>
            <Input id="admin-email" name="email" type="email" required autoComplete="off" maxLength={180} className="h-10 rounded-lg bg-white" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password" className="font-semibold text-slate-700">Mot de passe initial <span className="font-normal text-slate-400">(8 caractères minimum)</span></Label>
            <Input id="admin-password" name="password" type="password" required minLength={8} maxLength={72} autoComplete="new-password" className="h-10 rounded-lg bg-white" />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" disabled={pending} className="h-10 gap-2 rounded-lg px-4 font-semibold">
              {pending && busyId === null ? <Spinner /> : null} Créer le compte
            </Button>
          </div>
        </form>

        <p role="status" aria-live="polite" className={`min-h-5 text-sm ${status?.error ? "text-flag-red" : "text-congo"}`}>
          {status?.text}
        </p>
      </div>
    </section>
  )
}
