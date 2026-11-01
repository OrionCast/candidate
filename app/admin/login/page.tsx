import { LoginForm } from "@/components/admin/login-form"
import { LockIcon } from "@/components/site/icons"
import { Card, CardContent } from "@/components/ui/card"

export default function AdminLoginPage() {
  return (
    <section className="flex items-center justify-center py-10">
      <div className="animate-fade-up w-full max-w-md">
        <Card className="rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
          <CardContent className="p-8 sm:p-10">
            <div className="mb-8 text-center">
              <div className="mb-5 inline-flex size-16 items-center justify-center rounded-2xl bg-congo text-white shadow-lg shadow-congo/30">
                <LockIcon size={26} />
              </div>
              <h1 className="font-heading text-2xl font-bold text-slate-800">Connexion administrateur</h1>
              <p className="mt-2 text-sm text-slate-500">Accédez au tableau de bord de suivi des candidatures.</p>
            </div>
            <LoginForm />
          </CardContent>
        </Card>
        <p className="mt-6 text-center text-xs text-slate-400">Portail officiel · République du Congo</p>
      </div>
    </section>
  )
}
