export type GalleryCategory = "formation" | "atelier" | "evenement" | "campus"

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

export type GalleryItem = {
  id: string
  category: GalleryCategory
  /** Taille dans la grille : large (2 colonnes) ou haute (2 lignes). */
  size?: "wide" | "tall"
  /** Identifiant de la photo sur images.unsplash.com. */
  photo: string
  title: string
  place: string
}

/** Photos d'illustration reprises du projet d'origine, à remplacer par les vraies photos du programme. */
export const GALLERY: GalleryItem[] = [
  { id: "1", category: "formation", size: "wide", photo: "photo-1517048676732-d65bc937f952", title: "Session d'ouverture — Promotion 2026", place: "Brazzaville · CCIAMB" },
  { id: "2", category: "atelier", size: "tall", photo: "photo-1531482615713-2afd69097998", title: "Atelier pratique — Administration réseau", place: "Configuration et sécurité" },
  { id: "3", category: "campus", photo: "photo-1497366216548-37526070297c", title: "Campus numérique — Salle de formation", place: "Pointe-Noire" },
  { id: "4", category: "formation", photo: "photo-1522202176988-66273c2fd55f", title: "Travail collaboratif entre apprenants", place: "Projets en équipe" },
  { id: "5", category: "evenement", size: "wide", photo: "photo-1540575467063-178a50c2df87", title: "Cérémonie de lancement officiel", place: "Autorités et partenaires" },
  { id: "6", category: "atelier", photo: "photo-1516321318423-f06f85e504b3", title: "Atelier Cloud — Virtualisation", place: "AWS · Azure · GCP" },
  { id: "7", category: "campus", photo: "photo-1524178232363-1fb2b075b655", title: "Espace de travail collaboratif", place: "Salles équipées" },
  { id: "8", category: "formation", photo: "photo-1522071820081-009f0129c71c", title: "Session de mentorat avec les formateurs", place: "Accompagnement personnalisé" },
  { id: "9", category: "evenement", photo: "photo-1505373877841-8d25f7d46678", title: "Remise des attestations", place: "Cérémonie de clôture" },
  { id: "10", category: "atelier", photo: "photo-1552664730-d307ca884978", title: "Atelier de résolution de problèmes", place: "Cas pratiques" },
  { id: "11", category: "campus", photo: "photo-1562774053-701939374585", title: "Vue extérieure du campus", place: "Brazzaville" },
  { id: "12", category: "formation", photo: "photo-1498050108023-c5249f4df085", title: "Travaux pratiques sur machines", place: "Laboratoire informatique" },
]

export const photoUrl = (photo: string, width: number, quality: number) =>
  `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=${width}&q=${quality}`
