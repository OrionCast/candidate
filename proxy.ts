import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

/**
 * Contrôle optimiste de /admin : rafraîchit la session Supabase et redirige les visiteurs.
 * La vraie vérification se refait dans chaque page et Server Action (requireAdmin).
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data } = await supabase.auth.getClaims()
  const isAdmin = data?.claims?.app_metadata?.role === "admin"
  const isLoginPage = request.nextUrl.pathname === "/admin/login"

  const redirectTo = (path: string) => {
    const redirect = NextResponse.redirect(new URL(path, request.url))
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie))
    return redirect
  }

  if (!isAdmin && !isLoginPage) return redirectTo("/admin/login")
  if (isAdmin && isLoginPage) return redirectTo("/admin")

  return response
}

export const config = {
  matcher: ["/admin/:path*"],
}
