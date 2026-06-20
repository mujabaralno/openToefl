"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={cn(
        "fixed top-0 z-50 w-full border-b backdrop-blur-xl transition-all duration-300",
        scrolled ? "border-border bg-background/90 shadow-sm" : "border-border/50 bg-background/70"
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-8">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-bold tracking-tight transition-opacity hover:opacity-80"
          >
            Open TOEFL
          </Link>
          <div className="hidden items-center gap-8 md:flex"></div>
        </div>

        {/* Right: Auth buttons */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link href="/login">Masuk</Link>
          </Button>
          <Button
            asChild
            className="rounded-full px-5 py-2.5 text-sm font-medium shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-95"
          >
            <Link href="/register">Daftar Sekarang</Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}
