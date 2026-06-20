import { LandingNavbar } from "@/components/landing/organisms/landing-navbar";
import { HeroSection } from "@/components/landing/organisms/hero-section";
import { PreviewSection } from "@/components/landing/organisms/preview-section";
import { FeaturesSection } from "@/components/landing/organisms/features-section";
import { CtaSection } from "@/components/landing/organisms/cta-section";
import { LandingFooter } from "@/components/landing/organisms/landing-footer";

export function LandingTemplate() {
  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Subtle Background Effects */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="bg-grid-pattern absolute inset-0 opacity-50" />
        <div className="absolute left-1/2 top-[-20%] h-[50%] w-[80%] -translate-x-1/2 rounded-full bg-foreground/5 blur-[100px]" />
      </div>

      <LandingNavbar />

      <main className="relative pb-24">
        <HeroSection />
        <PreviewSection />
        <FeaturesSection />
        <CtaSection />
      </main>

      <LandingFooter />
    </div>
  );
}
