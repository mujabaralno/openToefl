"use client"

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { RadarPoint } from "@/lib/charts"

// chart-2 (ungu) agar konsisten dengan ScoreTrendChart dan kontras di latar terang
const config = {
  score: { label: "Skor", color: "var(--chart-2)" },
} satisfies ChartConfig

const tickStyle = {
  fontFamily: "var(--font-sans)",
  fontSize: 16,
  fill: "var(--muted-foreground)",
}

/** Penanda titik berbentuk kotak dengan border, pengganti dot bulat. */
function PixelDot({ cx, cy }: { cx?: number; cy?: number }) {
  if (cx == null || cy == null) return null
  return (
    <rect
      x={cx - 5}
      y={cy - 5}
      width={10}
      height={10}
      fill="var(--color-score)"
      stroke="var(--border)"
      strokeWidth={2}
      shapeRendering="crispEdges"
    />
  )
}

export function SectionBalanceChart({ data }: { data: RadarPoint[] }) {
  return (
    <ChartContainer config={config} className="mx-auto aspect-square h-[240px]">
      <RadarChart data={data} outerRadius="68%">
        <ChartTooltip
          content={
            <ChartTooltipContent className="rounded-none border-3 border-border bg-popover font-mono text-xs shadow-sm" />
          }
        />
        <PolarGrid
          stroke="var(--border)"
          strokeOpacity={0.3}
          strokeWidth={2}
          strokeDasharray="6 6"
        />
        <PolarAngleAxis dataKey="section" tick={tickStyle} />
        <Radar
          dataKey="score"
          fill="var(--color-score)"
          fillOpacity={0.35}
          stroke="var(--color-score)"
          strokeWidth={4}
          strokeLinejoin="miter"
          dot={<PixelDot />}
          isAnimationActive={false}
        />
      </RadarChart>
    </ChartContainer>
  )
}