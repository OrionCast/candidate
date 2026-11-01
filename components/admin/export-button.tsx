"use client"

import { useState } from "react"
import { DownloadIcon } from "@/components/site/icons"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

export function ExportButton() {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function download() {
    setPending(true)
    setError(null)
    try {
      const response = await fetch("/admin/export")
      if (!response.ok) throw new Error()
      const url = URL.createObjectURL(await response.blob())
      const link = document.createElement("a")
      link.href = url
      link.download = "candidatures.csv"
      link.click()
      URL.revokeObjectURL(url)
    } catch {
      setError("Impossible de générer l'export.")
    } finally {
      setPending(false)
    }
  }

  return (
    <>
      <Button type="button" variant="outline" onClick={download} disabled={pending} className="h-10 gap-2 rounded-lg px-4 font-semibold">
        {pending ? <Spinner /> : <DownloadIcon />}
        {pending ? "Export en cours…" : "Exporter en CSV"}
      </Button>
      {error && (
        <span role="alert" className="self-center text-sm text-flag-red">
          {error}
        </span>
      )}
    </>
  )
}
