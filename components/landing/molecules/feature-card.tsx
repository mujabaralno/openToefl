import type { LucideIcon } from "lucide-react"
import { IconBox } from "@/components/landing/atoms/icon-box"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  number: string
  className?: string
}

export function FeatureCard({ icon, title, description, number, className }: FeatureCardProps) {
  return (
    <Card
      className={cn(
        "h-full rounded-none border-2 border-border bg-card p-0 shadow-sm ring-0",
        className
      )}
    >
      <CardHeader className="gap-6 p-6 sm:p-7">
        <div className="flex items-start justify-between">
          <IconBox
            icon={icon}
            className="size-12 rounded-none border-2 border-border bg-primary text-primary-foreground shadow-xs"
          />
          <span className="font-mono text-xs text-muted-foreground">/{number}</span>
        </div>
        <div>
          <CardTitle>
            <h3 className="font-mono text-sm leading-relaxed">{title}</h3>
          </CardTitle>
          <CardDescription className="mt-3 text-xl leading-snug">{description}</CardDescription>
        </div>
      </CardHeader>
    </Card>
  )
}
