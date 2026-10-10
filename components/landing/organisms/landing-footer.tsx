import { Gamepad2 } from "lucide-react"
import Link from "next/link"
import { FooterLinkGroup } from "@/components/landing/molecules/footer-link-group"

const PRODUCT_LINKS = [
  { label: "Simulasi", href: "#simulation" },
  { label: "Fitur", href: "#features" },
  { label: "Masuk", href: "/login" },
]

export function LandingFooter() {
  return (
    <footer className="border-t-2 border-border bg-card py-10">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:grid-cols-[1fr_auto] sm:px-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-3" aria-label="PTESOL beranda">
            <span className="grid size-9 place-items-center border-2 border-border bg-primary text-primary-foreground shadow-xs">
              <Gamepad2 className="size-5" aria-hidden="true" />
            </span>
            <span className="font-serif text-sm">
              PTESOL<span className="font-mono text-[10px] text-muted-foreground">.ITP</span>
            </span>
          </Link>
          <p className="mt-4 max-w-sm text-xl leading-snug text-muted-foreground">
            Ruang latihan TOEFL ITP untuk mahasiswa.
            <br />
            Sedikit latihan hari ini, selangkah lebih siap esok.
          </p>
        </div>
        <FooterLinkGroup title="JELAJAHI" links={PRODUCT_LINKS} />
        <div className="flex flex-col justify-between gap-3 border-t border-border pt-6 text-base text-muted-foreground sm:col-span-2 sm:flex-row">
          <p>© {new Date().getFullYear()} PTESOL. Belajar, berlatih, bertumbuh.</p>
          <p className="font-mono text-[9px]">KEEP LEARNING. KEEP PLAYING.</p>
        </div>
      </div>
    </footer>
  )
}
