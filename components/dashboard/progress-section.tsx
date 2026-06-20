import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScoreTrendChart } from "@/components/charts/score-trend-chart"
import { SectionComparisonChart } from "@/components/charts/section-comparison-chart"
import { SectionBalanceChart } from "@/components/charts/section-balance-chart"
import {
  toScoreTrend,
  toSectionBalance,
  toSectionComparison,
  type ProgressAttempt,
} from "@/lib/charts"

interface ProgressSectionProps {
  attempts: ProgressAttempt[]
}

export function ProgressSection({ attempts }: ProgressSectionProps) {
  if (attempts.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          Belum ada data progres. Selesaikan simulasi pertama untuk melihat
          grafik perkembangan skor.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Tren Skor</CardTitle>
          <CardDescription>Total skor dari waktu ke waktu.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScoreTrendChart data={toScoreTrend(attempts)} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Skor per Seksi</CardTitle>
            <CardDescription>Perbandingan antar tes.</CardDescription>
          </CardHeader>
          <CardContent>
            <SectionComparisonChart data={toSectionComparison(attempts)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Keseimbangan Seksi</CardTitle>
            <CardDescription>Skor tes terakhir.</CardDescription>
          </CardHeader>
          <CardContent>
            <SectionBalanceChart data={toSectionBalance(attempts)} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
