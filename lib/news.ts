export type NewsCategory = "Guides pratiques" | "Conseils" | "Suivi des dossiers"

export type NewsItem = {
  id: string
  number: string
  category: NewsCategory
  badge: string
  tone: "info" | "warning" | "danger"
  kicker: string
  title: string
  text: string
  href: string
  cta: string
  meta: string
}

/** Contenu de démonstration repris du projet d'origine, à remplacer par les annonces officielles. */
export const NEWS_CATEGORIES: NewsCategory[] = ["Guides pratiques", "Conseils", "Suivi des dossiers"]

export const NEWS: NewsItem[] = [
  {
    id: "guide-candidat",
    number: "01",
    category: "Guides pratiques",
    badge: "Information pratique",
    tone: "info",
    kicker: "Candidature en ligne",
    title: "Comment bien préparer et structurer son dossier de candidature ?",
    text: "Avant de valider votre formulaire en ligne, vérifiez l'exactitude de vos coordonnées personnelles, la validité de votre pièce d'identité nationale et la numérisation complète de vos diplômes requis.",
    href: "/candidature",
    cta: "Accéder au formulaire de dépôt",
    meta: "Temps de lecture : 3 min",
  },
  {
    id: "pieces-jointes",
    number: "02",
    category: "Conseils",
    badge: "À retenir",
    tone: "warning",
    kicker: "Conseil aux candidats",
    title: "Vérifiez la lisibilité et le format de vos pièces jointes",
    text: "Les documents flous ou incomplets peuvent entraîner un retard dans le traitement de votre demande. Assurez-vous d'utiliser le format PDF ou JPG et de ne pas dépasser la taille maximale tolérée.",
    href: "/candidature",
    cta: "Voir les consignes requises",
    meta: "Documents requis",
  },
  {
    id: "code-reference",
    number: "03",
    category: "Suivi des dossiers",
    badge: "Important",
    tone: "danger",
    kicker: "Après soumission",
    title: "Conservez précieusement votre code de référence",
    text: "Dès la confirmation de votre dépôt, un numéro d'enregistrement unique vous est attribué. Ce code est obligatoire pour effectuer tout suivi ou adresser une demande d'assistance.",
    href: "/contact",
    cta: "Obtenir de l'aide / Contact",
    meta: "Suivi dossier",
  },
]
