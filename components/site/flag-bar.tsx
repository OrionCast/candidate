import { cn } from "@/lib/utils"

/** Bande vert / jaune / rouge du drapeau. */
export function FlagBar({ className }: { className?: string }) {
  return <div className={cn("h-1 bg-gradient-to-r from-congo via-gold to-flag-red", className)} />
}
