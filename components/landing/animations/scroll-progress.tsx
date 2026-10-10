"use client"

import { useEffect, useRef } from "react"
import { gsap } from "@/lib/gsap"
import { prefersReducedMotion } from "@/lib/motion"

export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.4,
          },
        }
      )
    })

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-primary"
    />
  )
}
