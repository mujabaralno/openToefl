import {
  BarChart3,
  BrainCircuit,
  ClipboardCheck,
  Headphones,
  LibraryBig,
  Trophy,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { FeatureCard } from "@/components/landing/molecules/feature-card";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: ClipboardCheck,
    title: "Simulasi penuh",
    description:
      "Kerjakan tiga seksi TOEFL ITP dengan timer, navigasi soal, dan alur ujian yang konsisten.",
  },
  {
    icon: Headphones,
    title: "Latihan per seksi",
    description:
      "Fokus pada Listening, Structure, atau Reading tanpa harus memulai simulasi penuh.",
  },
  {
    icon: BarChart3,
    title: "Skor dan riwayat",
    description:
      "Lihat skor total 310–677, hasil per seksi, dan perkembangan dari percobaan sebelumnya.",
  },
  {
    icon: BrainCircuit,
    title: "Analisis jawaban",
    description:
      "Tinjau pola kesalahan dan gunakan analisis AI saat konfigurasi layanan tersedia.",
  },
  {
    icon: LibraryBig,
    title: "Bank soal terkelola",
    description:
      "Dosen dan staf dapat mengelola soal, passage, audio, serta sesi tes dari satu panel admin.",
  },
  {
    icon: Trophy,
    title: "Leaderboard",
    description:
      "Bandingkan hasil dalam sesi yang sama saat pengelola mengaktifkan peringkat peserta.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="border-y border-border bg-muted/30 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-medium text-primary">Satu tempat untuk persiapan tes</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Dari latihan sampai evaluasi hasil.
          </h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            Mahasiswa mendapat ruang latihan yang jelas. Pengelola mendapat alat untuk menyiapkan
            soal dan memantau sesi.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
