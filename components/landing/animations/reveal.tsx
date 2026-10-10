"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

type RevealVariant = "up" | "pop" | "left" | "right";

const FROM: Record<RevealVariant, Record<string, number>> = {
  up: { y: 48 },
  pop: { y: 24, scale: 0.92 },
  left: { x: -56 },
  right: { x: 56 },
};

const EASE: Record<RevealVariant, string> = {
  up: "power3.out",
  pop: "back.out(1.6)",
  left: "power3.out",
  right: "power3.out",
};

interface RevealProps {
  children: ReactNode;
  className?: string;
  variant?: RevealVariant;
  stagger?: number;
  delay?: number;
  duration?: number;
  start?: string;
  once?: boolean;
}

export function Reveal({
  children,
  className,
  variant = "up",
  stagger = 0,
  delay = 0,
  duration = 0.8,
  start = "top 85%",
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const targets: Element[] | Element =
      stagger > 0 ? Array.from(el.children) : el;
    if (Array.isArray(targets) && targets.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.from(targets, {
        ...FROM[variant],
        autoAlpha: 0,
        duration,
        delay,
        stagger,
        ease: EASE[variant],
        clearProps: "transform,opacity,visibility",
        scrollTrigger: { trigger: el, start, once },
      });
    }, el);

    return () => ctx.revert();
  }, [variant, stagger, delay, duration, start, once]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
