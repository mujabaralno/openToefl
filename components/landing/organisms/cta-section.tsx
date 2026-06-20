import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CtaSection() {
  return (
    <section className="mx-auto max-w-[1200px] px-8">
      <div className="relative overflow-hidden rounded-3xl bg-foreground p-10 text-center text-background shadow-2xl md:p-16">
        {/* Radial glow overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div className="absolute -left-[20%] -top-[100%] h-[200%] w-[150%] bg-[radial-gradient(ellipse_at_center,_hsl(var(--background)/0.2),_transparent)] blur-[80px]" />
        </div>

        <h2 className="relative z-10 mb-6 text-3xl font-bold tracking-tight md:text-[40px] md:leading-[1.1]">
          Siap untuk Mencapai Skor Impian Anda?
        </h2>
        <p className="relative z-10 mx-auto mb-10 max-w-[600px] text-lg leading-relaxed text-background/70">
          Bergabunglah dengan lebih dari 50,000 siswa yang telah sukses dengan persiapan berbasis
          data kami.
        </p>
        <div className="relative z-10">
          <Button
            asChild
            variant="secondary"
            className="h-auto rounded-full px-10 py-4 text-base font-semibold shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl active:scale-95"
          >
            <Link href="/register">Mulai Sekarang — Gratis</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
