"use client"

import { useRef, useState, useTransition } from "react"
import {
  addGalleryItem,
  deleteGalleryItem,
  prepareGalleryUpload,
  setGalleryPublished,
  updateGalleryItem,
} from "@/app/admin/content-actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import {
  CATEGORY_LABEL,
  GALLERY_BUCKET,
  GALLERY_CATEGORIES,
  GALLERY_MAX_SIZE,
  GALLERY_MIMES,
  SIZE_LABEL,
  type GalleryCategory,
  type GalleryEntry,
  type GallerySize,
} from "@/lib/gallery"
import { createBrowserSupabase } from "@/lib/supabase/browser"

type Fields = { category: GalleryCategory; title: string; place: string; size: GallerySize | "normal" }

const EMPTY: Fields = { category: "formation", title: "", place: "", size: "normal" }

type Result = { ok: true } | { ok: false; error: string }

function FieldsForm({ fields, onChange }: { fields: Fields; onChange: (next: Fields) => void }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="photo-title" className="font-semibold text-slate-700">Titre</Label>
        <Input id="photo-title" value={fields.title} onChange={(e) => onChange({ ...fields, title: e.target.value })} required maxLength={200} className="h-10 rounded-lg bg-white" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="photo-place" className="font-semibold text-slate-700">Lieu ou légende <span className="font-normal text-slate-400">(facultatif)</span></Label>
        <Input id="photo-place" value={fields.place} onChange={(e) => onChange({ ...fields, place: e.target.value })} maxLength={120} className="h-10 rounded-lg bg-white" />
      </div>
      <div className="space-y-2">
        <Label className="font-semibold text-slate-700">Catégorie</Label>
        <Select value={fields.category} onValueChange={(v) => onChange({ ...fields, category: v as GalleryCategory })}>
          <SelectTrigger className="h-10 w-full rounded-lg bg-white"><SelectValue /></SelectTrigger>
          <SelectContent>
            {GALLERY_CATEGORIES.map((c) => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label className="font-semibold text-slate-700">Taille dans la grille</Label>
        <Select value={fields.size} onValueChange={(v) => onChange({ ...fields, size: v as Fields["size"] })}>
          <SelectTrigger className="h-10 w-full rounded-lg bg-white sm:max-w-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            {(["normal", "wide", "tall"] as const).map((s) => <SelectItem key={s} value={s}>{SIZE_LABEL[s]}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

const payload = (fields: Fields) => ({
  category: fields.category,
  title: fields.title,
  place: fields.place,
  size: fields.size === "normal" ? null : fields.size,
})

/** Ajout (envoi direct vers Supabase), modification, masquage et suppression des photos. */
export function GalleryManager({ items }: { items: GalleryEntry[] }) {
  const [pending, startTransition] = useTransition()
  const [busyId, setBusyId] = useState<string | null>(null)
  const [fields, setFields] = useState<Fields>(EMPTY)
  const [editing, setEditing] = useState<{ id: string; fields: Fields } | null>(null)
  const [status, setStatus] = useState<{ text: string; error: boolean } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

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

  async function upload(): Promise<Result> {
    const file = fileRef.current?.files?.[0]
    if (!file) return { ok: false, error: "Choisissez une photo." }
    if (!(file.type in GALLERY_MIMES)) return { ok: false, error: "Format accepté : JPG, PNG ou WebP." }
    if (file.size > GALLERY_MAX_SIZE) return { ok: false, error: "La photo dépasse 10 Mo." }

    const prepared = await prepareGalleryUpload({ type: file.type, size: file.size })
    if (!prepared.ok) return prepared

    const { error } = await createBrowserSupabase()
      .storage.from(GALLERY_BUCKET)
      .uploadToSignedUrl(prepared.path, prepared.token, file, { contentType: file.type })
    if (error) return { ok: false, error: "L'envoi de la photo a échoué." }

    return addGalleryItem({ ...payload(fields), imagePath: prepared.path })
  }

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-5">
        <h2 className="text-lg font-bold text-slate-800">Galerie photos</h2>
        <p className="mt-0.5 text-sm text-slate-500">
          Photos affichées sur la page « Galerie ». Les nouvelles photos apparaissent en premier ; masquez ou supprimez
          les images d'illustration quand vous avez les vôtres.
        </p>
      </div>

      <div className="space-y-6 p-5">
        <form
          onSubmit={(event) => {
            event.preventDefault()
            run(null, upload, "Photo ajoutée.", () => {
              setFields(EMPTY)
              if (fileRef.current) fileRef.current.value = ""
            })
          }}
          className="space-y-4 rounded-lg border border-dashed border-congo-line bg-[#f8fdf9] p-4"
        >
          <p className="text-sm font-semibold text-slate-800">Ajouter une photo</p>
          <div className="space-y-2">
            <Label htmlFor="photo-file" className="font-semibold text-slate-700">Fichier <span className="font-normal text-slate-400">(JPG, PNG ou WebP, 10 Mo maximum)</span></Label>
            <Input
              ref={fileRef}
              id="photo-file"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              required
              className="h-10 cursor-pointer rounded-lg bg-white p-0 pr-3 file:mr-3 file:h-full file:rounded-none file:bg-congo file:px-4 file:font-semibold file:text-white"
            />
          </div>
          <FieldsForm fields={fields} onChange={setFields} />
          <Button type="submit" disabled={pending} className="h-10 gap-2 rounded-lg px-4 font-semibold">
            {pending && busyId === null ? <Spinner /> : null} Ajouter la photo
          </Button>
        </form>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.length === 0 && <li className="text-sm text-slate-500">Aucune photo pour le moment.</li>}
          {items.map((item) => (
            <li key={item.id} className="overflow-hidden rounded-lg border border-slate-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.src} alt={item.title} loading="lazy" className={`h-36 w-full object-cover ${item.published ? "" : "opacity-40 grayscale"}`} />
              <div className="space-y-2 p-3">
                <p className="line-clamp-2 text-sm font-semibold text-slate-800">{item.title}</p>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <Badge variant="secondary" className="bg-slate-100 text-slate-600">{CATEGORY_LABEL[item.category]}</Badge>
                  {!item.uploaded && <Badge variant="secondary" className="bg-amber-100 text-amber-800">Illustration</Badge>}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="flex items-center gap-2 text-xs text-slate-600">
                    {pending && busyId === item.id ? <Spinner /> : null}
                    <Switch
                      size="sm"
                      checked={item.published}
                      disabled={pending}
                      onCheckedChange={(checked) =>
                        run(item.id, () => setGalleryPublished(item.id, checked), checked ? "Photo affichée." : "Photo masquée.")
                      }
                      aria-label={`${item.title} : ${item.published ? "affichée" : "masquée"}`}
                    />
                    {item.published ? "Affichée" : "Masquée"}
                  </label>
                  <div className="flex gap-1">
                    <Button type="button" size="xs" variant="ghost" className="rounded-md" onClick={() => setEditing({ id: item.id, fields: { category: item.category, title: item.title, place: item.place, size: item.size ?? "normal" } })}>
                      Modifier
                    </Button>
                    <Button
                      type="button"
                      size="xs"
                      variant="destructive"
                      disabled={pending}
                      className="rounded-md"
                      onClick={() => {
                        if (confirm(`Supprimer « ${item.title} » ? Cette action est définitive.`)) {
                          run(item.id, () => deleteGalleryItem(item.id), "Photo supprimée.")
                        }
                      }}
                    >
                      Supprimer
                    </Button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <p role="status" aria-live="polite" className={`min-h-5 text-sm ${status?.error ? "text-flag-red" : "text-congo"}`}>
          {status?.text}
        </p>
      </div>

      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="rounded-2xl sm:max-w-xl">
          {editing && (
            <form
              onSubmit={(event) => {
                event.preventDefault()
                run(editing.id, () => updateGalleryItem(editing.id, payload(editing.fields)), "Photo modifiée.", () => setEditing(null))
              }}
              className="space-y-4"
            >
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-slate-800">Modifier la photo</DialogTitle>
                <DialogDescription>L'image elle-même ne change pas : supprimez-la et ajoutez-en une autre pour la remplacer.</DialogDescription>
              </DialogHeader>
              <FieldsForm fields={editing.fields} onChange={(next) => setEditing({ id: editing.id, fields: next })} />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setEditing(null)} className="rounded-lg">Annuler</Button>
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
