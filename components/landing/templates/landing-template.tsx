import { LandingNavbar } from "@/components/landing/organisms/landing-navbar"
import { HeroSection } from "@/components/landing/organisms/hero-section"
import { PreviewSection } from "@/components/landing/organisms/preview-section"
import { FeaturesSection } from "@/components/landing/organisms/features-section"
import { CtaSection } from "@/components/landing/organisms/cta-section"
import { LandingFooter } from "@/components/landing/organisms/landing-footer"
import { SmoothScroll } from "@/components/landing/animations/smooth-scroll"
import { Ticker } from "@/components/landing/animations/ticker"
import styles from "./landing-template.module.css"

export function LandingTemplate() {
  return (
    <SmoothScroll>
      <div
        className={`${styles.landing} relative min-h-dvh overflow-x-clip bg-background text-foreground selection:bg-primary selection:text-primary-foreground`}
      >
        <a
          href="#landing-content"
          data-smooth-scroll="off"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:border-2 focus:border-border focus:bg-primary focus:px-4 focus:py-2 focus:text-xl focus:text-primary-foreground focus:shadow-md"
        >
          Lewati ke konten utama
        </a>

        <LandingNavbar />

        <main id="landing-content" tabIndex={-1} className="scroll-mt-24 outline-none">
          <HeroSection />
          <Ticker />
          <PreviewSection />
          <FeaturesSection />
          <CtaSection />
        </main>

        <LandingFooter />
      </div>
    </SmoothScroll>
  )
}
