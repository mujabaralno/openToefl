import { AnnouncementBadge } from "@/components/landing/molecules/announcement-badge";
import { HeroActions } from "@/components/landing/molecules/hero-actions";

const TEST_SUMMARY = [
  { value: "3 seksi", label: "Listening, Structure, Reading" },
  { value: "310–677", label: "Rentang skor TOEFL ITP" },
  { value: "Gratis", label: "Simulasi dan latihan mandiri" },
];

export function HeroSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pt-24 lg:px-8 lg:pb-28 lg:pt-28">
      <div className="grid items-end gap-12 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="max-w-3xl">
          <AnnouncementBadge label="Simulasi TOEFL ITP untuk mahasiswa" className="mb-6" />
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl lg:leading-[1.08]">
            Latihan dengan format tes yang akan Anda hadapi.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
            Kerjakan Listening, Structure, dan Reading dalam satu alur. PTESOL menghitung skor
            310–677 dan menyimpan riwayat hasil agar progres Anda mudah diperiksa.
          </p>
          <div className="mt-8">
            <HeroActions />
          </div>
        </div>

        <dl className="grid gap-px overflow-hidden rounded-xl border border-border bg-border shadow-sm sm:grid-cols-3 lg:grid-cols-1">
          {TEST_SUMMARY.map((item) => (
            <div key={item.value} className="bg-card px-5 py-4">
              <dt className="text-sm text-muted-foreground">{item.label}</dt>
              <dd className="mt-1 text-lg font-semibold tracking-tight">{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
