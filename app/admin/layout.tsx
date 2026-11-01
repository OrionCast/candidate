import type { Metadata } from "next"
import Link from "next/link"
import { FlagBar } from "@/components/site/flag-bar"

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <>
      <header className="bg-gradient-to-r from-congo-forest to-congo text-white shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
          <Link href="/admin" className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/15 font-extrabold">
              PC<span className="ml-0.5 text-[10px] text-gold">◆</span>
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-base font-bold">Administration des candidatures</span>
              <span className="block truncate text-xs text-white/70">République du Congo</span>
            </span>
          </Link>
          <Link href="/" className="shrink-0 text-sm underline underline-offset-2 transition hover:no-underline">
            Voir le site public →
          </Link>
        </div>
        <FlagBar />
      </header>
      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-8">{children}</main>
    </>
  )
}
