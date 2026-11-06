"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowUp01Icon } from "@hugeicons/core-free-icons"
import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"

const REVEAL_SELECTOR = ".scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-zoom"

/**
 * Effets liés au défilement : apparition progressive des blocs, barre de progression,
 * ombre de l'en-tête et bouton « retour en haut ».
 */
export function ScrollEffects() {
  const pathname = usePathname()
  const progressRef = useRef<HTMLDivElement>(null)
  const topRef = useRef<HTMLButtonElement>(null)

  // Réobserve les blocs à chaque changement de page.
  useEffect(() => {
    const elements = document.querySelectorAll(REVEAL_SELECTOR)
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (reduced || !("IntersectionObserver" in window)) {
      elements.forEach((el) => el.classList.add("is-visible"))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [pathname])

  useEffect(() => {
    let ticking = false

    const update = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      if (progressRef.current) {
        progressRef.current.style.width = `${maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0}%`
      }
      document.getElementById("siteHeader")?.classList.toggle("is-stuck", scrollTop > 10)
      topRef.current?.classList.toggle("show", scrollTop > 600)
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update)
        ticking = true
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    update()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <div ref={progressRef} className="scroll-progress" aria-hidden="true" />
      <button
        ref={topRef}
        type="button"
        className="to-top"
        aria-label="Retour en haut de page"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <HugeiconsIcon icon={ArrowUp01Icon} size={20} strokeWidth={2.5} />
      </button>
    </>
  )
}
