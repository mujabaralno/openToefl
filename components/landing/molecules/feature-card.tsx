import { cn } from "@/lib/utils";
import { IconBox } from "@/components/landing/atoms/icon-box";
import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  className,
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        "group rounded-2xl border border-border/60 p-10 transition-all duration-300",
        "bg-card/50 hover:border-primary/20 hover:bg-card hover:shadow-lg",
        className
      )}
    >
      <IconBox icon={icon} className="mb-8" />
      <h3 className="mb-4 text-xl font-semibold tracking-tight">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
