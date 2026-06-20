"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
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

export function SectionComparisonChart({
  data,
}: {
  data: SectionComparisonPoint[]
}) {
  return (
    <ChartContainer config={config} className="h-[240px] w-full">
      <BarChart data={data} margin={{ top: 8, bottom: 4 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis domain={[0, 68]} tickLine={false} axisLine={false} width={28} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="listening" fill="var(--color-listening)" radius={3} />
        <Bar dataKey="structure" fill="var(--color-structure)" radius={3} />
        <Bar dataKey="reading" fill="var(--color-reading)" radius={3} />
      </BarChart>
    </ChartContainer>
  )
}
