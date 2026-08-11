import { BookOpenCheck } from "lucide-react";
import Link from "next/link";
import { FooterLinkGroup } from "@/components/landing/molecules/footer-link-group";

const PRODUCT_LINKS = [
  { label: "Simulasi", href: "#simulation" },
  { label: "Fitur", href: "#features" },
  { label: "Masuk", href: "/login" },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-card py-12">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-[1fr_auto] lg:px-8">
        <div className="max-w-xs">
          <Link href="/" className="inline-flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <BookOpenCheck className="size-4" aria-hidden="true" />
            </span>
            PTESOL
          </Link>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Platform simulasi TOEFL ITP untuk mahasiswa, dosen, dan staf pengelola tes.
          </p>
        </div>

        <div className="w-40">
          <FooterLinkGroup title="Navigasi" links={PRODUCT_LINKS} />
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl border-t border-border px-4 pt-6 text-sm text-muted-foreground sm:px-6 lg:px-8">
        © {new Date().getFullYear()} PTESOL.
      </div>
    </footer>
  );
}
