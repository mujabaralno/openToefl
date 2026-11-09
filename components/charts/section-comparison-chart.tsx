"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { SectionComparisonPoint } from "@/lib/charts"

const config = {
  listening: { label: "Listening", color: "var(--chart-1)" },
  structure: { label: "Structure", color: "var(--chart-2)" },
  reading: { label: "Reading", color: "var(--chart-3)" },
} satisfies ChartConfig

const tickStyle = {
  fontFamily: "var(--font-sans)",
  fontSize: 16,
  fill: "var(--muted-foreground)",
}

// Setiap batang: tanpa radius, dengan border ink agar warna lime tetap tegas
const barProps = {
  radius: 0,
  stroke: "var(--border)",
  strokeWidth: 2,
  isAnimationActive: false,
} as const

/** Legend gaya pixel: kotak 12px bergaris + label VT323. */
function PixelLegend({
  payload,
}: {
  payload?: ReadonlyArray<{ dataKey?: unknown; value?: unknown }>
}) {
  if (!payload?.length) return null
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 pt-3 text-lg leading-none">
      {payload.map((item) => {
        const key = String(item.dataKey ?? item.value)
        const label = config[key as keyof typeof config]?.label ?? key
        return (
          <span key={key} className="flex items-center gap-2 text-foreground">
            <span
              aria-hidden="true"
              className="size-3 border-2 border-border"
              style={{ backgroundColor: `var(--color-${key})` }}
            />
            {label}
          </span>
        )
      })}
    </div>
  )
}

export function SectionComparisonChart({
  data,
}: {
  data: SectionComparisonPoint[]
}) {
  return (
    <ChartContainer config={config} className="h-[240px] w-full">
      <BarChart data={data} margin={{ top: 8, bottom: 4 }} barGap={4}>
        <CartesianGrid
          vertical={false}
          stroke="var(--border)"
          strokeOpacity={0.3}
          strokeWidth={2}
          strokeDasharray="6 6"
        />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={{ stroke: "var(--border)", strokeWidth: 3 }}
          tickMargin={8}
          tick={tickStyle}
        />
        <YAxis
          domain={[0, 68]}
          tickLine={false}
          axisLine={false}
          width={32}
          tick={tickStyle}
        />
        <ChartTooltip
          cursor={{ fill: "var(--muted)", fillOpacity: 0.5 }}
          content={
            <ChartTooltipContent className="rounded-none border-3 border-border bg-popover font-mono text-xs shadow-sm" />
          }
        />
        <ChartLegend content={<PixelLegend />} />
        <Bar dataKey="listening" fill="var(--color-listening)" {...barProps} />
        <Bar dataKey="structure" fill="var(--color-structure)" {...barProps} />
        <Bar dataKey="reading" fill="var(--color-reading)" {...barProps} />
      </BarChart>
    </ChartContainer>
  )
}