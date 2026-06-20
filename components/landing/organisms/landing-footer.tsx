import Link from "next/link"
import { FooterLinkGroup } from "@/components/landing/molecules/footer-link-group"
import { SocialLinks } from "@/components/landing/molecules/social-links"

const PRODUCT_LINKS = [
  { label: "Simulasi", href: "#" },
  { label: "Bank Soal", href: "#" },
  { label: "Analisis AI", href: "#" },
]

export function LandingFooter() {
  return (
    <footer className="relative z-10 mt-20 border-t border-border bg-card pb-16 pt-20">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-start gap-12 px-8 md:grid-cols-2 lg:flex lg:justify-between lg:gap-24">
        {/* Brand Column */}
        <div className="max-w-xs">
          <Link
            href="/"
            className="mb-6 inline-block text-xl font-bold tracking-tight transition-opacity hover:opacity-80"
          >
            Open TOEFL
          </Link>
          <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
            © 2024 Open TOEFL. Persiapan berbasis performa untuk masa depan global Anda.
          </p>
          <SocialLinks />
        </div>

        {/* Link Columns */}
        <div className="grid w-full grid-cols-2 gap-16 lg:w-auto lg:gap-24">
          <FooterLinkGroup title="Produk" links={PRODUCT_LINKS} />
        </div>
      </div>
    </footer>
  )
}
