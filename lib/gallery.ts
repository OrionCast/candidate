export const GALLERY_CATEGORY_IDS = ["formation", "atelier", "evenement", "campus"] as const
export type GalleryCategory = (typeof GALLERY_CATEGORY_IDS)[number]

export const GALLERY_CATEGORIES: { id: GalleryCategory; label: string }[] = [
  { id: "formation", label: "Formations" },
  { id: "atelier", label: "Ateliers" },
  { id: "evenement", label: "Événements" },
  { id: "campus", label: "Campus" },
]

export const CATEGORY_LABEL: Record<GalleryCategory, string> = {
  formation: "Formation",
  atelier: "Atelier",
  evenement: "Événement",
  campus: "Campus",
}

export const GALLERY_SIZES = ["wide", "tall"] as const
export type GallerySize = (typeof GALLERY_SIZES)[number]

export const SIZE_LABEL: Record<GallerySize | "normal", string> = {
  normal: "Normale",
  wide: "Large (2 colonnes)",
  tall: "Haute (2 lignes)",
}

/** Photo de la galerie, avec l'adresse complète de l'image. */
export type GalleryEntry = {
  id: string
  category: GalleryCategory
  size: GallerySize | null
  src: string
  title: string
  place: string
  published: boolean
  /** Vrai pour une photo envoyée sur le site (et non une image d'illustration externe). */
  uploaded: boolean
}

export const GALLERY_BUCKET = "gallery"

export const GALLERY_MIMES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
}

export const GALLERY_MAX_SIZE = 10 * 1024 * 1024

type GalleryRow = {
  id: string
  category: GalleryCategory
  title: string
  place: string
  size: GallerySize | null
  image_path: string | null
  external_url: string | null
  published: boolean
}

export const GALLERY_COLUMNS = "id, category, title, place, size, image_path, external_url, published"

/** `publicUrl` transforme le chemin d'un fichier du bucket en adresse publique. */
export function mapGallery(row: GalleryRow, publicUrl: (path: string) => string): GalleryEntry | null {
  const src = row.image_path ? publicUrl(row.image_path) : row.external_url
  if (!src) return null
  return {
    id: row.id,
    category: row.category,
    size: row.size,
    src,
    title: row.title,
    place: row.place,
    published: row.published,
    uploaded: Boolean(row.image_path),
  }
}

/** Les photos d'illustration Unsplash acceptent des paramètres de taille ; les autres non. */
export function resizedSrc(src: string, width: number, quality: number) {
  return src.includes("images.unsplash.com") && !src.includes("?")
    ? `${src}?auto=format&fit=crop&w=${width}&q=${quality}`
    : src
}
