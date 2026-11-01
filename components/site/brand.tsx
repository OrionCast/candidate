import Link from "next/link"
import { cn } from "@/lib/utils"

export function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-congo text-sm font-extrabold text-white shadow-sm">
        PC<span className="ml-0.5 text-[10px] text-gold">◆</span>
      </span>
      <span className="leading-tight">
        <strong className={cn("block text-sm", light ? "text-white" : "text-congo-forest")}>
          Portail de candidature
        </strong>
        <small className={cn("text-xs", light ? "text-white/70" : "text-muted-foreground")}>
          République du Congo
        </small>
      </span>
    </Link>
  )
}
