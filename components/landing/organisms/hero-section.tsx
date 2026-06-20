import { AnnouncementBadge } from "@/components/landing/molecules/announcement-badge";
import { GradientHeading } from "@/components/landing/atoms/gradient-heading";
import { HeroActions } from "@/components/landing/molecules/hero-actions";

export function HeroSection() {
  return (
    <section className="relative z-10 mx-auto mb-24 max-w-[1200px] px-8 pt-40 text-center">
      <AnnouncementBadge
        label="Simulasi Generatif Baru Telah Hadir"
        className="mb-10"
      />

      <GradientHeading className="mb-8">
        Kuasai TOEFL dengan{" "}
        <br className="hidden md:block" />
        Presisi Maksimal
      </GradientHeading>

      <p className="mx-auto mb-10 max-w-[700px] text-lg leading-relaxed text-muted-foreground">
        Rasakan platform simulasi TOEFL paling realistis yang dirancang untuk
        pelajar berperforma tinggi. Skor instan, analisis mendalam, dan
        pengalaman ujian nyata.
      </p>

      <HeroActions />
    </section>
  );
}
