"use client"

import { useEffect, useRef } from "react"

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  base: number
  phase: number
  speed: number
  color: string
}

const COLORS = ["250,204,21", "255,255,255", "125,211,252"] // jaune, blanc, bleu clair

type Props = {
  /** Particules par pixel² du conteneur. */
  density: number
  /** Distance maximale (px) à laquelle deux particules sont reliées. */
  link: number
}

/**
 * Particules reliées qui fuient le curseur. Se place dans un parent `relative`
 * dont il épouse la taille ; sans mouvement si l'utilisateur préfère moins d'animations.
 */
export function Particles({ density, link }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const host = canvas?.parentElement
    const ctx = canvas?.getContext("2d")
    if (!canvas || !host || !ctx) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const mouse = { x: -9999, y: -9999 }
    let width = 0
    let height = 0
    let particles: Particle[] = []
    let frame: number | null = null
    let visible = true

    const make = (): Particle => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      base: 1.6 + Math.random() * 2.4,
      phase: Math.random() * Math.PI * 2,
      speed: 0.012 + Math.random() * 0.02,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    })

    const draw = (animate: boolean) => {
      ctx.clearRect(0, 0, width, height)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        if (animate) {
          p.x += p.vx
          p.y += p.vy
          p.phase += p.speed
          if (p.x < -10) p.x = width + 10
          else if (p.x > width + 10) p.x = -10
          if (p.y < -10) p.y = height + 10
          else if (p.y > height + 10) p.y = -10

          const dx = p.x - mouse.x
          const dy = p.y - mouse.y
          const d2 = dx * dx + dy * dy
          if (d2 < 14000) {
            const d = Math.sqrt(d2) || 1
            p.x += (dx / d) * 0.8
            p.y += (dy / d) * 0.8
          }
        }

        const pulse = (Math.sin(p.phase) + 1) / 2
        const radius = p.base * (0.6 + pulse * 0.9)
        const alpha = 0.35 + pulse * 0.6

        ctx.beginPath()
        ctx.arc(p.x, p.y, radius * 3.2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.color},${alpha * 0.12})`
        ctx.fill()

        ctx.beginPath()
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.color},${alpha})`
        ctx.fill()

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const dx = p.x - q.x
          const dy = p.y - q.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance < link) {
            ctx.strokeStyle = `rgba(255,255,255,${0.22 * (1 - distance / link)})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.stroke()
          }
        }
      }
    }

    const loop = () => {
      if (!visible) {
        frame = null
        return
      }
      draw(true)
      frame = requestAnimationFrame(loop)
    }

    const start = () => {
      if (!reduced && frame === null) frame = requestAnimationFrame(loop)
    }

    const resize = () => {
      const rect = host.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = width * ratio
      canvas.height = height * ratio
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
      const count = Math.max(18, Math.min(90, Math.round(width * height * density)))
      particles = Array.from({ length: count }, make)
      if (reduced) draw(false)
    }

    const onMove = (event: MouseEvent) => {
      const rect = host.getBoundingClientRect()
      mouse.x = event.clientX - rect.left
      mouse.y = event.clientY - rect.top
    }
    const onLeave = () => {
      mouse.x = mouse.y = -9999
    }

    host.addEventListener("mousemove", onMove, { passive: true })
    host.addEventListener("mouseleave", onLeave)

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(host)

    const visibility = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting
      if (visible) start()
    })
    visibility.observe(host)

    resize()
    start()

    return () => {
      if (frame !== null) cancelAnimationFrame(frame)
      host.removeEventListener("mousemove", onMove)
      host.removeEventListener("mouseleave", onLeave)
      resizeObserver.disconnect()
      visibility.disconnect()
    }
  }, [density, link])

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 size-full" />
}
