import { cacheLife, cacheTag } from "next/cache"
import { GALLERY_BUCKET, GALLERY_COLUMNS, mapGallery, type GalleryEntry } from "@/lib/gallery"
import { NEWS_COLUMNS, mapNews, type NewsItem } from "@/lib/news"
import { DEFAULT_SETTINGS, mapSettings, type SiteSettings } from "@/lib/site-settings"
import { createPublicClient } from "@/lib/supabase/public"

/**
 * Lecture du contenu public. Chaque fonction est mise en cache jusqu'à ce que l'administrateur
 * modifie le contenu correspondant (updateTag). Si la base est indisponible, on retombe sur des
 * valeurs par défaut plutôt que de casser la page.
 */

export async function getSiteSettings(): Promise<SiteSettings> {
  "use cache"
  cacheTag("settings")
  cacheLife("hours")

  const { data } = await createPublicClient().from("site_settings").select("*").eq("id", 1).maybeSingle()
  return data ? mapSettings(data) : DEFAULT_SETTINGS
}

export async function getActiveSpecialties(): Promise<string[]> {
  "use cache"
  cacheTag("specialties")
  cacheLife("hours")

  const { data } = await createPublicClient()
    .from("specialties")
    .select("name")
    .eq("active", true)
    .order("name")
  return (data ?? []).map((row) => row.name as string)
}

export async function getPublishedNews(): Promise<NewsItem[]> {
  "use cache"
  cacheTag("news")
  cacheLife("hours")

  const { data } = await createPublicClient()
    .from("news")
    .select(NEWS_COLUMNS)
    .eq("published", true)
    .order("published_at", { ascending: false })
  return (data ?? []).map(mapNews)
}

export async function getPublishedGallery(): Promise<GalleryEntry[]> {
  "use cache"
  cacheTag("gallery")
  cacheLife("hours")

  const supabase = createPublicClient()
  const { data } = await supabase
    .from("gallery_items")
    .select(GALLERY_COLUMNS)
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })

  const publicUrl = (path: string) => supabase.storage.from(GALLERY_BUCKET).getPublicUrl(path).data.publicUrl
  return (data ?? []).flatMap((row) => mapGallery(row, publicUrl) ?? [])
}
