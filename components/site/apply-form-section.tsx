import { ApplyForm } from "@/components/site/apply-form"
import { getActiveCities } from "@/lib/cities"

/** Charge les villes gérées par l'admin, puis affiche le formulaire. */
export async function ApplyFormSection() {
  const cities = await getActiveCities()
  return <ApplyForm cities={cities} />
}
