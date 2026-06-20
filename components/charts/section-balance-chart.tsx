"use client"

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { RadarPoint } from "@/lib/charts"

const config = {
  score: { label: "Skor", color: "var(--chart-1)" },
} satisfies ChartConfig

export function SectionBalanceChart({ data }: { data: RadarPoint[] }) {
  return (
    <ChartContainer config={config} className="mx-auto aspect-square h-[240px]">
      <RadarChart data={data}>
        <ChartTooltip content={<ChartTooltipContent />} />
        <PolarGrid />
        <PolarAngleAxis dataKey="section" />
        <Radar
          dataKey="score"
          fill="var(--color-score)"
          fillOpacity={0.5}
          stroke="var(--color-score)"
        />
      </RadarChart>
    </ChartContainer>
  )
}
