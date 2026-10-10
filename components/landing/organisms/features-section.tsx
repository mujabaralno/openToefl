import {
  BarChart3,
  BrainCircuit,
  ClipboardCheck,
  Headphones,
  LibraryBig,
  Trophy,
} from "lucide-react"
import { FeatureCard } from "@/components/landing/molecules/feature-card"
import { Reveal } from "@/components/landing/animations/reveal"

const FEATURES = [
  {
    icon: ClipboardCheck,
    title: "Simulasi penuh",
    description:
      "Tiga seksi dalam satu alur ujian. Biasakan diri dengan timer dan navigasi soal sebelum hari tes.",
  },
  {
    icon: Headphones,
    title: "Latihan per seksi",
    description:
      "Listening, Structure, atau Reading. Pilih bagian yang ingin kamu kuasai, lalu latih dengan fokus.",
  },
  {
    icon: BarChart3,
    title: "Progres yang terlihat",
    description:
      "Lihat skor total, hasil per seksi, dan riwayat latihan. Kenali bagian yang masih perlu diasah.",
  },
  {
    icon: BrainCircuit,
    title: "Kenali pola kesalahan",
    description:
      "Tinjau kembali jawabanmu dan manfaatkan analisis AI untuk membantu menentukan fokus belajar.",
  },
  {
    icon: LibraryBig,
    title: "Soal yang terkelola",
    description:
      "Soal, passage, audio, dan sesi tes dikelola dosen atau staf dalam satu panel yang terpusat.",
  },
  {
    icon: Trophy,
    title: "Tantangan bersama",
    description:
      "Lihat posisimu di leaderboard sesi saat peringkat diaktifkan. Jadikan motivasi untuk latihan lagi.",
  },
] as const

export function FeaturesSection() {
  return (
    <section
      id="features"
      aria-labelledby="features-title"
      className="scroll-mt-20 border-y-2 border-border bg-muted py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal
          className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end"
          stagger={0.1}
        >
          <div>
            <p className="font-mono text-[10px] text-muted-foreground">02 / ISI INVENTORY-MU</p>
            <h2
              id="features-title"
              className="mt-4 font-serif text-xl leading-relaxed tracking-[-0.04em] sm:text-2xl"
            >
              Bekal lengkap.
              <br />
              Siap naik level.
            </h2>
          </div>
          <p className="max-w-sm text-xl leading-snug text-muted-foreground">
            Dari latihan pertama sampai evaluasi hasil, semua ada di satu tempat.
          </p>
        </Reveal>
        <Reveal className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
          {FEATURES.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              {...feature}
              number={String(index + 1).padStart(2, "0")}
            />
          ))}
        </Reveal>
      </div>
    </section>
  )
}
