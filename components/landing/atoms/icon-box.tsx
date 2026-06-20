import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface IconBoxProps {
  icon: LucideIcon;
  className?: string;
}

export function IconBox({ icon: Icon, className }: IconBoxProps) {
  return (
    <div
      className={cn(
        "flex h-14 w-14 items-center justify-center rounded-xl shadow-sm transition-colors duration-300",
        "bg-secondary group-hover:bg-primary group-hover:text-primary-foreground",
        className
      )}
    >
      <Icon className="size-6" />
    </div>
  );
}
