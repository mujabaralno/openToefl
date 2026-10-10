import { ArrowUpRight, Check, Flag } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Reveal } from "@/components/landing/animations/reveal"

const BENEFITS = ["Gratis untuk mulai", "Hasil tersimpan di akunmu"]

export function CtaSection() {
  return (
    <section
      id="start"
      aria-labelledby="start-title"
      className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20 sm:px-8 lg:py-24"
    >
      <Reveal>
        <Card className="relative gap-0 rounded-none border-2 border-border bg-primary p-7 text-primary-foreground shadow-xl ring-0 sm:p-12 lg:p-14">
          <div className="mb-8 flex items-center justify-between gap-4 border-b border-primary-foreground/30 pb-5">
            <p className="font-mono text-[10px]">03 / YOUR JOURNEY STARTS HERE</p>
            <Flag className="size-5 shrink-0" aria-hidden="true" />
          </div>
          <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <h2
                id="start-title"
                className="font-serif text-xl leading-relaxed tracking-[-0.05em] sm:text-3xl lg:text-4xl"
              >
                Target besar.
                <br />
                Mulai satu soal.
              </h2>
              <p className="mt-5 max-w-lg text-2xl leading-snug">
                Tak perlu menunggu siap. Cari tahu kemampuanmu hari ini, lalu buat progresmu
                sendiri.
              </p>
            </div>
            <div className="flex flex-col gap-4 lg:pb-1">
              <Button
                asChild
                size="lg"
                className="h-14 rounded-none border-2 border-primary-foreground bg-primary-foreground px-6 font-mono text-xs text-primary shadow-md hover:-translate-y-1 hover:bg-primary-foreground active:translate-y-1 active:shadow-none"
              >
                <Link href="/register">
                  MULAI PETUALANGAN <ArrowUpRight className="ml-2 size-5" aria-hidden="true" />
                </Link>
              </Button>
              <p className="text-center text-lg">
                Sudah punya akun?{" "}
                <Link href="/login" className="underline underline-offset-4 hover:decoration-2">
                  Masuk di sini
                </Link>
              </p>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-2 text-lg sm:flex-row sm:gap-7">
            {BENEFITS.map((benefit) => (
              <span key={benefit} className="flex items-center gap-2">
                <Check className="size-4" aria-hidden="true" />
                {benefit}
              </span>
            ))}
          </div>
        </Card>
      </Reveal>
    </section>
  )
}
