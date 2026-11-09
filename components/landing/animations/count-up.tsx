"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

interface CountUpProps {
  value: string;
  className?: string;
}

export function CountUp({ value, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const nodes = el.querySelectorAll<HTMLElement>("[data-count]");
    if (nodes.length === 0) return;

    const ctx = gsap.context(() => {
      nodes.forEach((node) => {
        const target = Number(node.dataset.count ?? "0");
        const width = node.dataset.count?.length ?? String(target).length;
        const proxy = { value: 0 };

        node.textContent = String(0).padStart(width, "0");

        gsap.to(proxy, {
          value: target,
          duration: 1.1,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
          onUpdate: () => {
            node.textContent = String(Math.round(proxy.value)).padStart(
              width,
              "0"
            );
          },
        });
      });
    }, el);

    return () => ctx.revert();
  }, [value]);

  const parts = value.split(/(\d+)/g).filter((part) => part !== "");

  return (
    <span ref={ref} className={className}>
      {parts.map((part, index) =>
        /^\d+$/.test(part) ? (
          <span key={index} data-count={part} suppressHydrationWarning>
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  );
}
