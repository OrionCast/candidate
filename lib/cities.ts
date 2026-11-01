import { cacheLife, cacheTag } from "next/cache"
import { createPublicClient } from "@/lib/supabase/public"

/** Villes proposées au public, mises en cache jusqu'à la prochaine modification admin. */
export async function getActiveCities(): Promise<string[]> {
  "use cache"
  cacheTag("cities")
  cacheLife("hours")

  const { data } = await createPublicClient()
    .from("cities")
    .select("name")
    .eq("active", true)
    .order("name")

  return (data ?? []).map((city) => city.name as string)
}
