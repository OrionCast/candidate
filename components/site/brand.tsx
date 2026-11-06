import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

/** Logo de la CCIAMB et titre du portail. `light` : version pour fond sombre (pied de page). */
export function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="group flex shrink-0 items-center gap-4 py-2">
      <span className={cn(light && "rounded-2xl bg-white p-2 shadow-lg")}>
        <Image
          src="/assets/logo-cciamb.png"
          alt="Logo CCIAMB"
          width={524}
          height={476}
          priority={!light}
          className="h-16 w-auto shrink-0 object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-105 sm:h-20"
        />
      </span>
      <span
        className={cn(
          "hidden leading-tight sm:block",
          !light && "border-l-2 border-emerald-100 pl-4"
        )}
      >
        <strong className={cn("block text-sm tracking-tight sm:text-base", light ? "text-white" : "text-congo")}>
          Portail de candidature
        </strong>
        <small className={cn("text-xs font-medium", light ? "text-white" : "text-congo")}>Formation PATN</small>
      </span>
    </Link>
  )
}
