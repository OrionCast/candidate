"use client"

import { useState } from "react"
import { DownloadIcon } from "@/components/site/icons"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

type Props = {
  href: string
  /** Nom du fichier si le serveur n'en indique pas (en-tête Content-Disposition). */
  fallbackName: string
  label: string
  busyLabel?: string
  size?: "default" | "sm"
  variant?: "outline" | "default"
  className?: string
}

/** Télécharge un fichier généré par le serveur, avec un indicateur de chargement. */
export function DownloadButton({
  href,
  fallbackName,
  label,
  busyLabel = "Préparation…",
  size = "default",
  variant = "outline",
  className,
}: Props) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function download() {
    setPending(true)
    setError(null)
    try {
      const response = await fetch(href)
      if (!response.ok) throw new Error()
      const disposition = response.headers.get("Content-Disposition") ?? ""
      const name = /filename="([^"]+)"/.exec(disposition)?.[1] ?? fallbackName
      const url = URL.createObjectURL(await response.blob())
      const link = document.createElement("a")
      link.href = url
      link.download = name
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    } catch {
      setError("Téléchargement impossible.")
    } finally {
      setPending(false)
    }
  }

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size={size}
        onClick={download}
        disabled={pending}
        className={className ?? "h-10 gap-2 rounded-lg px-4 font-semibold"}
      >
        {pending ? <Spinner /> : <DownloadIcon />}
        {pending ? busyLabel : label}
      </Button>
      {error && (
        <span role="alert" className="self-center text-xs text-flag-red">
          {error}
        </span>
      )}
    </>
  )
}
