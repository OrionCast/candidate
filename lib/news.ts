export const NEWS_CATEGORIES = ["Guides pratiques", "Conseils", "Suivi des dossiers"] as const
export type NewsCategory = (typeof NEWS_CATEGORIES)[number]

export const NEWS_TONES = ["info", "warning", "danger"] as const
export type NewsTone = (typeof NEWS_TONES)[number]

export const TONE_LABEL: Record<NewsTone, string> = {
  info: "Information (vert)",
  warning: "À retenir (jaune)",
  danger: "Important (rouge)",
}

/** Actualité telle qu'elle est affichée sur la page publique. */
export type NewsItem = {
  id: string
  title: string
  body: string
  category: NewsCategory
  badge: string
  tone: NewsTone
  kicker: string
  linkLabel: string
  linkHref: string
  meta: string
  publishedAt: string
}

/** Actualité complète, telle que l'administrateur la modifie. */
export type NewsRecord = NewsItem & { published: boolean }

type NewsRow = {
  id: string
  title: string
  body: string
  category: NewsCategory
  badge: string
  tone: NewsTone
  kicker: string
  link_label: string
  link_href: string
  meta: string
  published: boolean
  published_at: string
}

export function mapNews(row: NewsRow): NewsRecord {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    category: row.category,
    badge: row.badge,
    tone: row.tone,
    kicker: row.kicker,
    linkLabel: row.link_label,
    linkHref: row.link_href,
    meta: row.meta,
    published: row.published,
    publishedAt: row.published_at,
  }
}

export const NEWS_COLUMNS =
  "id, title, body, category, badge, tone, kicker, link_label, link_href, meta, published, published_at"
