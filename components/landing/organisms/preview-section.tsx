import { ArrowUpRight, Clock3 } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Reveal } from "@/components/landing/animations/reveal"
import { PreviewAnswers } from "@/components/landing/molecules/preview-answers"

export function PreviewSection() {
  return (
    <section
      id="simulation"
      aria-labelledby="simulation-title"
      className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20 sm:px-8 lg:py-24"
    >
      <Reveal
        className="mb-9 flex flex-col justify-between gap-5 md:flex-row md:items-end"
        stagger={0.1}
      >
        <div>
          <p className="font-mono text-[10px] text-muted-foreground">01 / KENALI ARENA</p>
          <h2
            id="simulation-title"
            className="mt-4 max-w-xl font-serif text-xl leading-relaxed tracking-[-0.04em] sm:text-2xl"
          >
            Latihan serius.
            <br />
            Suasana lebih santai.
          </h2>
        </div>
        <p className="max-w-sm text-xl leading-snug text-muted-foreground">
          Passage, soal, dan waktu dalam satu layar. Biar fokusmu tetap pada jawaban.
        </p>
      </Reveal>
      <Reveal>
        <Card className="gap-0 rounded-none border-2 border-border p-0 shadow-xl ring-0">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-border bg-muted px-5 py-4 sm:px-7">
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="size-3 border border-border bg-primary" />
              <span className="font-mono text-[10px] sm:text-xs">READING / QUESTION 12 OF 50</span>
            </div>
            <Badge
              variant="outline"
              className="h-auto rounded-none border-border bg-card py-1 font-mono text-[9px]"
            >
              PRATINJAU · CONTOH TAMPILAN
            </Badge>
          </div>
          <div className="grid lg:grid-cols-2">
            <article
              lang="en"
              className="border-b-2 border-border p-5 sm:p-8 lg:border-b-0 lg:border-r-2"
            >
              <p className="mb-5 font-mono text-[10px] text-muted-foreground">
                PASSAGE 01 / NATURAL SCIENCE
              </p>
              <h3 className="max-w-md font-serif text-sm leading-loose sm:text-base">
                The Impact of Glacial Erosion
              </h3>
              <div className="mt-6 space-y-5 text-xl leading-relaxed text-muted-foreground sm:text-2xl">
                <p>
                  Glacial erosion shapes the landscape as a glacier moves across the ground. The
                  process creates broad,{" "}
                  <mark className="bg-primary px-1 text-primary-foreground">U-shaped valleys</mark>{" "}
                  that differ from the V-shaped valleys made by rivers.
                </p>
                <p>
                  Two mechanisms drive this change: plucking removes pieces of rock, while abrasion
                  smooths the surface beneath the ice.
                </p>
              </div>
              <p className="mt-8 border-t border-border pt-4 text-lg text-muted-foreground">
                Baca passage, pahami konteks, pilih jawaban.
              </p>
            </article>
            <div className="bg-background p-5 sm:p-8">
              <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
                <span className="font-mono text-[10px] text-muted-foreground">PILIHAN JAWABAN</span>
                <span
                  className="flex items-center gap-2 text-xl"
                  aria-label="Contoh sisa waktu: 14 menit 32 detik"
                >
                  <Clock3 className="size-4" aria-hidden="true" />
                  14:32
                </span>
              </div>
              <PreviewAnswers />
              <div className="mt-7 border-t border-border pt-5">
                <div className="mb-3 flex justify-between font-mono text-[9px] text-muted-foreground">
                  <span>PROGRES SESI</span>
                  <span>12 / 50</span>
                </div>
                <Progress
                  value={24}
                  aria-label="Contoh progres simulasi 24 persen"
                  className="h-3 rounded-none border border-border bg-muted"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start justify-between gap-4 border-t-2 border-border bg-muted px-5 py-4 sm:flex-row sm:items-center sm:px-7">
            <p className="text-lg text-muted-foreground">
              Ini baru cuplikan. Simulasi lengkap menantimu.
            </p>
            <Button
              variant="link"
              asChild
              className="h-auto rounded-none p-0 font-mono text-[10px] text-foreground"
            >
              <Link href="/register">
                COBA SIMULASI <ArrowUpRight className="ml-2 size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </Card>
      </Reveal>
    </section>
  )
}
