"use client"

import { useActionState } from "react"
import { login, type LoginState } from "@/app/admin/login/actions"
import { ArrowRightIcon } from "@/components/site/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {})

  return (
    <form action={action} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email" className="font-semibold text-slate-700">
          Adresse e-mail
        </Label>
        <Input id="email" name="email" type="email" required autoComplete="username" placeholder="admin@exemple.com" className="h-11 rounded-lg bg-white" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="font-semibold text-slate-700">
          Mot de passe
        </Label>
        <Input id="password" name="password" type="password" required autoComplete="current-password" placeholder="••••••••" className="h-11 rounded-lg bg-white" />
      </div>
      <Button type="submit" disabled={pending} size="lg" className="h-12 w-full gap-2 rounded-lg font-semibold">
        {pending ? (
          <>
            <Spinner /> Connexion…
          </>
        ) : (
          <>
            Se connecter <ArrowRightIcon />
          </>
        )}
      </Button>
      <p role="alert" className="min-h-5 text-center text-sm text-flag-red">
        {state.error}
      </p>
    </form>
  )
}
