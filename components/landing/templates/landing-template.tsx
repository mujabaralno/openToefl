import { LandingNavbar } from "@/components/landing/organisms/landing-navbar";
import { HeroSection } from "@/components/landing/organisms/hero-section";
import { PreviewSection } from "@/components/landing/organisms/preview-section";
import { FeaturesSection } from "@/components/landing/organisms/features-section";
import { CtaSection } from "@/components/landing/organisms/cta-section";
import { LandingFooter } from "@/components/landing/organisms/landing-footer";

export function LandingTemplate() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <a
        href="#landing-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:border focus:border-border focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-card-foreground focus:shadow-md"
      >
        Lewati ke konten utama
      </a>

      <LandingNavbar />

      <main id="landing-content" className="pb-4">
        <HeroSection />
        <PreviewSection />
        <FeaturesSection />
        <CtaSection />
      </main>

      <LandingFooter />
    </div>
  );
}
