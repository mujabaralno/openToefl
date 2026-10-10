"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface HeroIntroProps {
  children: ReactNode;
  className?: string;
}

export function HeroIntro({ children, className }: HeroIntroProps) {
  const ref = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: "expo.out", duration: 0.9 },
      });

      timeline
        .from("[data-hero-line]", {
          y: 32,
          autoAlpha: 0,
          stagger: 0.1,
        })
        // kartu muncul, lalu bayangan solidnya "tercetak" dalam langkah pixel
        .from(
          "[data-hero-stat]",
          {
            y: 24,
            autoAlpha: 0,
            stagger: 0.1,
            clearProps: "transform,opacity,visibility",
          },
          "-=0.5"
        )
        .fromTo(
          "[data-hero-stat]",
          { "--o": "0px" },
          { "--o": "5px", duration: 0.5, stagger: 0.1, ease: "steps(5)" },
          "<+=0.4"
        );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}