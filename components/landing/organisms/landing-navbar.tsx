import { BookOpenCheck } from "lucide-react";
import Link from "next/link";
import { NavLink } from "@/components/landing/atoms/nav-link";
import { Button } from "@/components/ui/button";

export function LandingNavbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold tracking-tight"
            aria-label="PTESOL beranda"
          >
            <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <BookOpenCheck className="size-4" aria-hidden="true" />
            </span>
            PTESOL
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            <NavLink href="#simulation">Simulasi</NavLink>
            <NavLink href="#features">Fitur</NavLink>
            <NavLink href="#start">Mulai</NavLink>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild className="hidden sm:flex">
            <Link href="/login">Masuk</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Buat akun</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
