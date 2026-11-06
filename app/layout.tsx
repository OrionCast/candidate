import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
})
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" })

export const metadata: Metadata = {
  title: {
    default: "Portail de candidature | Formation PATN - CCIAMB",
    template: "%s | Formation PATN - CCIAMB",
  },
  description: "Programme PATN : formation gratuite de 300 jeunes en Réseaux, Connectivité et Cloud.",
  icons: { icon: "/assets/logo-cciamb.png" },
}

export const viewport: Viewport = {
  themeColor: "#087447",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={cn("h-full antialiased font-sans", inter.variable, playfair.variable, jetbrains.variable)}
    >
      <body className="flex min-h-full flex-col overflow-x-hidden text-slate-800">{children}</body>
    </html>
  )
}
