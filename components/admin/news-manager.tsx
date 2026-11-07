"use client"

import { useState, useTransition } from "react"
import { deleteNews, saveNews, setNewsPublished } from "@/app/admin/content-actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { NEWS_CATEGORIES, NEWS_TONES, TONE_LABEL, type NewsCategory, type NewsRecord, type NewsTone } from "@/lib/news"

type Draft = {
  id?: string
  title: string
  body: string
  category: NewsCategory
  badge: string
  tone: NewsTone
  kicker: string
  linkLabel: string
  linkHref: string
  meta: string
  published: boolean
}

const EMPTY: Draft = {
  title: "",
  body: "",
  category: "Guides pratiques",
  badge: "Information",
  tone: "info",
  kicker: "",
  linkLabel: "",
  linkHref: "",
  meta: "",
  published: true,
}

const toneBadge: Record<NewsTone, string> = {
  info: "bg-emerald-100 text-emerald-800",
  warning: "bg-amber-100 text-amber-800",
  danger: "bg-red-100 text-red-700",
}

const dateFormat = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeZone: "Africa/Brazzaville" })

/** Création, modification, publication et suppression des actualités. */
export function NewsManager({ items }: { items: NewsRecord[] }) {
  const [pending, startTransition] = useTransition()
  const [busyId, setBusyId] = useState<string | null>(null)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [dialogError, setDialogError] = useState<string | null>(null)
  const [status, setStatus] = useState<{ text: string; error: boolean } | null>(null)

  const patch = (changes: Partial<Draft>) => setDraft((current) => (current ? { ...current, ...changes } : current))

  function run(id: string | null, action: () => Promise<{ ok: true } | { ok: false; error: string }>, success: string, done?: () => void) {
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

  function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!draft) return
    setDialogError(null)
    startTransition(async () => {
      try {
        const result = await saveNews(draft)
        if (result.ok) {
          setDraft(null)
          setStatus({ text: "Actualité enregistrée.", error: false })
        } else {
          setDialogError(result.error)
        }
      } catch {
        setDialogError("Une erreur est survenue. Réessayez.")
      }
    })
  }

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-5">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Actualités</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Articles affichés sur la page « Actualités », du plus récent au plus ancien.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => {
            setDialogError(null)
            setDraft(EMPTY)
          }}
          className="h-10 rounded-lg px-4 font-semibold"
        >
          Nouvelle actualité
        </Button>
      </div>

      <div className="p-5">
        <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200">
          {items.length === 0 && <li className="p-4 text-sm text-slate-500">Aucune actualité pour le moment.</li>}
          {items.map((item) => (
            <li key={item.id} className="flex flex-wrap items-center gap-3 p-3 sm:px-4">
              <div className="min-w-0 flex-1">
                <p className={item.published ? "font-semibold text-slate-800" : "font-semibold text-slate-400"}>{item.title}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <Badge className={`h-auto rounded-md px-2 py-0.5 ${toneBadge[item.tone]}`}>{item.badge}</Badge>
                  <span>{item.category}</span>
                  <span>·</span>
                  <span>{dateFormat.format(new Date(item.publishedAt))}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="rounded-lg"
                  onClick={() => {
                    setDialogError(null)
                    setDraft({ ...item })
                  }}
                >
                  Modifier
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  disabled={pending}
                  className="rounded-lg"
                  onClick={() => {
                    if (confirm(`Supprimer « ${item.title} » ? Cette action est définitive.`)) {
                      run(item.id, () => deleteNews(item.id), "Actualité supprimée.")
                    }
                  }}
                >
                  Supprimer
                </Button>
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  {pending && busyId === item.id ? <Spinner /> : null}
                  <Switch
                    checked={item.published}
                    disabled={pending}
                    onCheckedChange={(checked) =>
                      run(item.id, () => setNewsPublished(item.id, checked), checked ? "Actualité publiée." : "Actualité masquée.")
                    }
                    aria-label={`${item.title} : ${item.published ? "publiée" : "masquée"}`}
                  />
                  {item.published ? "Publiée" : "Masquée"}
                </label>
              </div>
            </li>
          ))}
        </ul>
        <p role="status" aria-live="polite" className={`mt-3 min-h-5 text-sm ${status?.error ? "text-flag-red" : "text-congo"}`}>
          {status?.text}
        </p>
      </div>

      <Dialog open={draft !== null} onOpenChange={(open) => !open && setDraft(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl sm:max-w-2xl">
          {draft && (
            <form onSubmit={save} className="space-y-4">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-slate-800">
                  {draft.id ? "Modifier l'actualité" : "Nouvelle actualité"}
                </DialogTitle>
                <DialogDescription>Le texte s'affiche tel quel sur la page publique.</DialogDescription>
              </DialogHeader>

              <div className="space-y-2">
                <Label htmlFor="news-title" className="font-semibold text-slate-700">Titre</Label>
                <Input id="news-title" value={draft.title} onChange={(e) => patch({ title: e.target.value })} required maxLength={200} className="h-10 rounded-lg bg-white" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="news-body" className="font-semibold text-slate-700">Texte</Label>
                <Textarea id="news-body" value={draft.body} onChange={(e) => patch({ body: e.target.value })} required rows={5} maxLength={5000} className="rounded-lg bg-white" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="font-semibold text-slate-700">Catégorie</Label>
                  <Select value={draft.category} onValueChange={(v) => patch({ category: v as NewsCategory })}>
                    <SelectTrigger className="h-10 w-full rounded-lg bg-white"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {NEWS_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold text-slate-700">Couleur de l'étiquette</Label>
                  <Select value={draft.tone} onValueChange={(v) => patch({ tone: v as NewsTone })}>
                    <SelectTrigger className="h-10 w-full rounded-lg bg-white"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {NEWS_TONES.map((t) => <SelectItem key={t} value={t}>{TONE_LABEL[t]}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="news-badge" className="font-semibold text-slate-700">Étiquette</Label>
                  <Input id="news-badge" value={draft.badge} onChange={(e) => patch({ badge: e.target.value })} required maxLength={40} placeholder="Ex. Important" className="h-10 rounded-lg bg-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="news-kicker" className="font-semibold text-slate-700">Sur-titre <span className="font-normal text-slate-400">(facultatif)</span></Label>
                  <Input id="news-kicker" value={draft.kicker} onChange={(e) => patch({ kicker: e.target.value })} maxLength={80} placeholder="Ex. Après soumission" className="h-10 rounded-lg bg-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="news-link-label" className="font-semibold text-slate-700">Texte du lien <span className="font-normal text-slate-400">(facultatif)</span></Label>
                  <Input id="news-link-label" value={draft.linkLabel} onChange={(e) => patch({ linkLabel: e.target.value })} maxLength={80} placeholder="Ex. Accéder au formulaire" className="h-10 rounded-lg bg-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="news-link-href" className="font-semibold text-slate-700">Adresse du lien <span className="font-normal text-slate-400">(facultatif)</span></Label>
                  <Input id="news-link-href" value={draft.linkHref} onChange={(e) => patch({ linkHref: e.target.value })} maxLength={300} placeholder="/candidature ou https://…" className="h-10 rounded-lg bg-white" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="news-meta" className="font-semibold text-slate-700">Mention en bas à droite <span className="font-normal text-slate-400">(facultatif)</span></Label>
                <Input id="news-meta" value={draft.meta} onChange={(e) => patch({ meta: e.target.value })} maxLength={80} placeholder="Ex. Temps de lecture : 3 min" className="h-10 rounded-lg bg-white" />
              </div>

              <label className="flex items-center gap-3 text-sm text-slate-700">
                <Switch checked={draft.published} onCheckedChange={(checked) => patch({ published: checked })} aria-label="Publiée" />
                Publier tout de suite
              </label>

              {dialogError && <p role="alert" className="text-sm text-flag-red">{dialogError}</p>}

              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setDraft(null)} className="rounded-lg">Annuler</Button>
                <Button type="submit" disabled={pending} className="gap-2 rounded-lg px-5 font-semibold">
                  {pending && <Spinner />} Enregistrer
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
