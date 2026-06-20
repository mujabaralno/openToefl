import { Monitor, Brain, BarChart3 } from "lucide-react";
import { FeatureCard } from "@/components/landing/molecules/feature-card";
import type { LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: Monitor,
    title: "Simulasi Realistis",
    description:
      "Antarmuka yang 100% identik dengan ujian TOEFL iBT asli, membantu Anda beradaptasi dengan tekanan waktu dan navigasi tes.",
  },
  {
    icon: Brain,
    title: "Penilaian AI Instan",
    description:
      "Dapatkan hasil Speaking dan Writing dalam hitungan detik menggunakan model AI yang dilatih dengan rubrik resmi ETS.",
  },
  {
    icon: BarChart3,
    title: "Analisis Personal",
    description:
      "Identifikasi kelemahan spesifik Anda di setiap bagian dan terima rekomendasi materi belajar yang dipersonalisasi.",
  },
];

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="mx-auto mb-32 max-w-[1200px] px-8"
    >
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {FEATURES.map((feature) => (
          <FeatureCard
            key={feature.title}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  );
}
