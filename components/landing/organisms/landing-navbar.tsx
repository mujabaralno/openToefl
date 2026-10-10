import { ArrowUpRight, Gamepad2 } from "lucide-react"
import Link from "next/link"
import { NavLink } from "@/components/landing/atoms/nav-link"
import { ScrollProgress } from "@/components/landing/animations/scroll-progress"
import { Button } from "@/components/ui/button"

export function LandingNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b-2 border-border bg-background">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-3 px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="PTESOL beranda">
          <span className="grid size-10 place-items-center border-2 border-border bg-primary text-primary-foreground shadow-xs">
            <Gamepad2 className="size-6" aria-hidden="true" />
          </span>
          <span className="font-serif text-xs tracking-tight sm:text-sm">
            PTESOL
            <span className="hidden font-mono text-[10px] text-muted-foreground sm:inline">
              .ITP
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Menu utama">
          <NavLink
            href="#simulation"
            className="font-mono text-[11px] underline-offset-8 hover:underline"
          >
            Simulasi
          </NavLink>
          <NavLink
            href="#features"
            className="font-mono text-[11px] underline-offset-8 hover:underline"
          >
            Fitur
          </NavLink>
          <NavLink
            href="#start"
            className="font-mono text-[11px] underline-offset-8 hover:underline"
          >
            Mulai
          </NavLink>
        </nav>
        <div className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" asChild className="h-11 rounded-none px-2 text-lg sm:px-4">
            <Link href="/login">Masuk</Link>
          </Button>
          <Button
            asChild
            className="hidden h-11 rounded-none border-2 border-border px-4 font-mono text-[10px] shadow-xs hover:-translate-y-0.5 sm:inline-flex"
          >
            <Link href="/register">
              Buat akun <ArrowUpRight className="ml-2 size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
      <ScrollProgress />
    </header>
  )
}
