"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Brand } from "@/components/site/brand"
import { MenuIcon } from "@/components/site/icons"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const links = [
  { href: "/", label: "Accueil" },
  { href: "/actualites", label: "Actualités" },
  { href: "/galerie", label: "Galerie" },
  { href: "/candidature", label: "Candidature" },
  { href: "/contact", label: "Contact" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header id="siteHeader" className="header-blur sticky top-0 z-50 border-b border-slate-200/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-24 items-center justify-between gap-5 sm:h-28">
          <Brand />

          <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex" aria-label="Navigation principale">
            {links.map((link) => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn("nav-link", active && "text-congo")}
                >
                  {link.label}
                </Link>
              )
            })}
            <Link
              href="/admin"
              className="rounded-xl bg-congo px-5 py-2.5 text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-congo-dark hover:shadow-lg hover:shadow-congo/25"
            >
              Login ↗
            </Link>
          </nav>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon-lg"
                className="rounded-xl border-slate-200 bg-white text-slate-700 md:hidden"
                aria-label="Ouvrir le menu"
              >
                <MenuIcon size={22} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4 text-sm font-semibold text-slate-700" aria-label="Navigation mobile">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={pathname === link.href ? "page" : undefined}
                    className={cn(
                      "rounded-lg px-3 py-3 transition-colors hover:bg-emerald-50 hover:text-congo",
                      pathname === link.href && "bg-emerald-50 text-congo"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="mt-2 rounded-lg border border-congo px-3 py-3 text-congo"
                >
                  Login ↗
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
