/** « 2004-03-15 » → « 15/03/2004 », sans passer par Date (pas de décalage de fuseau). */
export function formatDateOnly(value: string | null | undefined) {
  if (!value) return "—"
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value)
  return match ? `${match[3]}/${match[2]}/${match[1]}` : value
}

/** Date et heure à Brazzaville, identiques côté serveur et navigateur. */
export function formatDateTime(value: string | null | undefined) {
  if (!value) return "—"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Africa/Brazzaville",
  }).format(date)
}
