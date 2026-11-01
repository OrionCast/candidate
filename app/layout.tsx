import type { Metadata, Viewport } from "next"
import { DM_Sans, Geist_Mono, Playfair_Display } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

export const metadata: Metadata = {
  title: { default: "Portail de candidature", template: "%s | Portail de candidature" },
  description: "Portail de candidature de la République du Congo",
}

export const viewport: Viewport = {
  themeColor: "#075b3d",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={cn("h-full antialiased font-sans", dmSans.variable, playfair.variable, geistMono.variable)}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  )
}
