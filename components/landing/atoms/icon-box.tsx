import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface IconBoxProps {
  icon: LucideIcon;
  className?: string;
}

export function IconBox({ icon: Icon, className }: IconBoxProps) {
  return (
    <div
      className={cn(
        "flex size-10 items-center justify-center rounded-lg border border-border bg-muted text-foreground",
        className
      )}
    >
      <Icon className="size-5" aria-hidden="true" />
    </div>
  );
}
