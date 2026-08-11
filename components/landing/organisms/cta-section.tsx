import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const BENEFITS = ["Tidak perlu kartu kredit", "Hasil tersimpan di akun Anda"];

export function CtaSection() {
  return (
    <section id="start" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="grid items-center gap-8 rounded-2xl border border-primary/20 bg-primary p-8 text-primary-foreground shadow-sm md:grid-cols-[1fr_auto] md:p-12">
        <div>
          <p className="text-sm font-medium text-primary-foreground/75">Mulai dari satu simulasi</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Ukur kemampuan Anda sebelum menentukan target belajar.
          </h2>
          <div className="mt-6 flex flex-col gap-3 text-sm text-primary-foreground/80 sm:flex-row sm:gap-6">
            {BENEFITS.map((benefit) => (
              <span key={benefit} className="flex items-center gap-2">
                <Check className="size-4" aria-hidden="true" />
                {benefit}
              </span>
            ))}
          </div>
        </div>
        <Button asChild size="lg" variant="secondary" className="w-full md:w-auto">
          <Link href="/register">
            Buat akun gratis
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
