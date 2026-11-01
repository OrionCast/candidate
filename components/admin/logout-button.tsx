import { logout } from "@/app/admin/actions"
import { LogoutIcon } from "@/components/site/icons"
import { Button } from "@/components/ui/button"

export function LogoutButton() {
  return (
    <form action={logout}>
      <Button type="submit" variant="destructive" className="h-10 gap-2 rounded-lg px-4 font-semibold">
        <LogoutIcon /> Déconnexion
      </Button>
    </form>
  )
}
