"use client"

import { useEffect, type ReactNode } from "react"
import Lenis from "lenis"
import { gsap, ScrollTrigger } from "@/lib/gsap"
import { prefersReducedMotion } from "@/lib/motion"

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (prefersReducedMotion()) return

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    })

    const onScroll = () => ScrollTrigger.update()
    lenis.on("scroll", onScroll)

    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      const anchor = target?.closest<HTMLAnchorElement>('a[href^="#"]')
      if (!anchor || anchor.dataset.smoothScroll === "off") return

      const hash = anchor.getAttribute("href")
      if (!hash || hash === "#") return

      const element = document.querySelector<HTMLElement>(hash)
      if (!element) return

      event.preventDefault()
      lenis.scrollTo(element)
    }

    const refresh = () => ScrollTrigger.refresh()
    document.addEventListener("click", onClick)
    window.addEventListener("load", refresh)

    return () => {
      document.removeEventListener("click", onClick)
      window.removeEventListener("load", refresh)
      gsap.ticker.remove(raf)
      lenis.off("scroll", onScroll)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
