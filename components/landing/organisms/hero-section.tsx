import { ArrowDown, Check } from "lucide-react"
import { AnnouncementBadge } from "@/components/landing/molecules/announcement-badge"
import { HeroActions } from "@/components/landing/molecules/hero-actions"
import { LevelScene } from "@/components/landing/molecules/level-scene"
import { HeroIntro } from "@/components/landing/animations/hero-intro"

const TEST_SUMMARY = [
  { value: "03", label: "Seksi dalam satu simulasi" },
  { value: "310–677", label: "Rentang skor TOEFL ITP" },
  { value: "GRATIS", label: "Latihan tanpa biaya" },
] as const

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-title"
      className="mx-auto max-w-7xl px-5 pb-10 pt-12 sm:px-8 sm:pt-16 lg:pb-12 lg:pt-20"
    >
      <HeroIntro className="grid items-center gap-x-14 gap-y-12 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <div data-hero-line className="mb-7">
            <AnnouncementBadge label="TOEFL ITP · PRESS START" />
          </div>
          <h1
            id="hero-title"
            data-hero-line
            className="font-serif text-[clamp(1.5rem,4.2vw,3.25rem)] leading-[1.55] tracking-[-0.06em]"
          >
            SKOR NAIK.
            <br />
            <span className="inline-block bg-primary px-2 text-primary-foreground shadow-md">
              MASA DEPAN
            </span>
            <br />
            UNLOCKED.
          </h1>
          <p
            data-hero-line
            className="mt-7 max-w-lg text-2xl leading-[1.3] text-muted-foreground sm:text-[1.65rem]"
          >
            Persiapan TOEFL ITP, satu level setiap hari. Latih kemampuanmu, kenali pola soal, dan
            kejar target skormu bersama PTESOL.
          </p>
          <div data-hero-line className="mt-8">
            <HeroActions />
            <p className="mt-5 flex items-center gap-2 text-lg text-muted-foreground">
              <Check className="size-4" aria-hidden="true" />
              Gratis. Belajar sesuai ritmemu.
            </p>
          </div>
        </div>
        <div data-hero-stat className="min-w-0 lg:pt-8">
          <LevelScene />
        </div>
      </HeroIntro>
      <div className="mt-12 flex flex-col gap-8 border-t-2 border-border pt-7 sm:mt-16 sm:flex-row sm:items-center sm:justify-between">
        <dl className="grid grid-cols-3 gap-5 sm:gap-12 lg:gap-20">
          {TEST_SUMMARY.map(({ value, label }) => (
            <div key={value} className="flex flex-col-reverse justify-end gap-2">
              <dt className="max-w-28 text-base leading-tight text-muted-foreground sm:max-w-none sm:text-lg">
                {label}
              </dt>
              <dd className="font-mono text-sm sm:text-lg">{value}</dd>
            </div>
          ))}
        </dl>
        <a
          href="#simulation"
          className="flex w-fit items-center gap-3 font-mono text-[10px] underline-offset-4 hover:underline"
        >
          EXPLORE THE GAME <ArrowDown className="size-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
