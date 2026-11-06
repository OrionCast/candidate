import { ScrollEffects } from "@/components/site/scroll-effects"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <ScrollEffects />
      <SiteHeader />
      <main className="flex-1 overflow-hidden">{children}</main>
      <SiteFooter />
    </>
  )
}
