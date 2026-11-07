/** Réglages du site gérés depuis l'administration (une seule ligne en base). */
export type SiteSettings = {
  applyOpensAt: string | null
  applyClosesAt: string | null
  /** Si vrai, le formulaire de candidature n'accepte les dépôts que pendant la période. */
  enforceWindow: boolean
  placesCount: number
  phonePrimary: string
  phoneSecondary: string
  contactEmail: string
  address: string
}

/** Valeurs utilisées tant que la table n'existe pas ou n'est pas lisible. */
export const DEFAULT_SETTINGS: SiteSettings = {
  applyOpensAt: "2026-11-22T23:00:00Z",
  applyClosesAt: "2026-12-06T22:59:59Z",
  enforceWindow: false,
  placesCount: 300,
  phonePrimary: "+242 06 895 32 75",
  phoneSecondary: "+242 05 745 89 42",
  contactEmail: "formationpatn@cciamb-cnia.cg",
  address: "92 Avenue Amilcar CABRAL, Centre-ville, Brazzaville",
}

type SettingsRow = {
  apply_opens_at: string | null
  apply_closes_at: string | null
  enforce_window: boolean
  places_count: number
  phone_primary: string
  phone_secondary: string
  contact_email: string
  address: string
}

export function mapSettings(row: SettingsRow | null | undefined): SiteSettings {
  if (!row) return DEFAULT_SETTINGS
  return {
    applyOpensAt: row.apply_opens_at,
    applyClosesAt: row.apply_closes_at,
    enforceWindow: row.enforce_window,
    placesCount: row.places_count,
    phonePrimary: row.phone_primary,
    phoneSecondary: row.phone_secondary,
    contactEmail: row.contact_email,
    address: row.address,
  }
}

export type ApplicationState = "open" | "not_yet" | "closed"

/** Le formulaire est-il ouvert ? Toujours « open » tant que la période n'est pas imposée. */
export function applicationState(settings: SiteSettings, now: number): ApplicationState {
  if (!settings.enforceWindow) return "open"
  if (settings.applyOpensAt && now < Date.parse(settings.applyOpensAt)) return "not_yet"
  if (settings.applyClosesAt && now > Date.parse(settings.applyClosesAt)) return "closed"
  return "open"
}

const TIME_ZONE = "Africa/Brazzaville"

/** Date (AAAA-MM-JJ) à Brazzaville, pour un champ « date » de formulaire. */
export function toBrazzavilleDate(iso: string | null | undefined) {
  if (!iso) return ""
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ""
  return new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }).format(date)
}

/** Début (00:00:00) ou fin (23:59:59) de journée à Brazzaville (UTC+1), au format ISO. */
export function fromBrazzavilleDate(date: string, endOfDay: boolean) {
  return `${date}T${endOfDay ? "23:59:59" : "00:00:00"}+01:00`
}

/** « 2026-11-23T… » → « 23 Novembre 2026 ». */
export function formatLongDate(iso: string | null | undefined) {
  if (!iso) return null
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null
  const text = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: TIME_ZONE,
  }).format(date)
  return text.replace(/^(\d+) (\p{L})/u, (_, day: string, first: string) => `${day} ${first.toUpperCase()}`)
}

/** « +242 06 895 32 75 » → « +242068953275 » pour un lien tel:. */
export const phoneHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`
