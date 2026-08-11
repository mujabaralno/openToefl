import type { LucideIcon } from "lucide-react";
import { IconBox } from "@/components/landing/atoms/icon-box";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
    <Card className={cn("h-full rounded-xl border-border bg-card shadow-sm", className)}>
      <CardHeader className="gap-4 p-6">
        <IconBox icon={icon} />
        <div className="space-y-2">
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription className="leading-6">{description}</CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
}
