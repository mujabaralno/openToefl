"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { ScoreTrendPoint } from "@/lib/charts"

// chart-2 (ungu) dipakai untuk garis: lime (chart-1) kurang kontras di latar terang
const config = {
  total: { label: "Total Skor", color: "var(--chart-2)" },
} satisfies ChartConfig

const tickStyle = {
  fontFamily: "var(--font-sans)",
  fontSize: 16,
  fill: "var(--muted-foreground)",
}

/** Penanda titik berbentuk kotak dengan border, pengganti dot bulat. */
function PixelDot({
  cx,
  cy,
  size = 10,
}: {
  cx?: number
  cy?: number
  size?: number
}) {
  if (cx == null || cy == null) return null
  return (
    <rect
      x={cx - size / 2}
      y={cy - size / 2}
      width={size}
      height={size}
      fill="var(--color-total)"
      stroke="var(--border)"
      strokeWidth={2}
      shapeRendering="crispEdges"
    />
  )
}

export function ScoreTrendChart({ data }: { data: ScoreTrendPoint[] }) {
  return (
    <ChartContainer config={config} className="h-[240px] w-full">
      <LineChart data={data} margin={{ left: 4, right: 12, top: 8, bottom: 4 }}>
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
          domain={[310, 677]}
          tickLine={false}
          axisLine={false}
          width={40}
          tick={tickStyle}
        />
        <ChartTooltip
          cursor={{
            stroke: "var(--border)",
            strokeWidth: 2,
            strokeDasharray: "4 4",
          }}
          content={
            <ChartTooltipContent className="rounded-none border-3 border-border bg-popover font-mono text-xs shadow-sm" />
          }
        />
        <Line
          dataKey="total"
          type="stepAfter"
          stroke="var(--color-total)"
          strokeWidth={4}
          strokeLinecap="square"
          strokeLinejoin="miter"
          dot={<PixelDot />}
          activeDot={<PixelDot size={14} />}
          isAnimationActive={false}
        />
      </LineChart>
    </ChartContainer>
  )
}