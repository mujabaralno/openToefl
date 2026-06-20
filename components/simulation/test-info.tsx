import { Card, CardContent } from "@/components/ui/card"
import { SECTION_CONFIG, SECTION_ORDER } from "@/lib/simulation"

const totalQuestions = SECTION_ORDER.reduce(
  (sum, section) => sum + SECTION_CONFIG[section].questionCount,
  0
)
const totalMinutes = SECTION_ORDER.reduce(
  (sum, section) => sum + SECTION_CONFIG[section].durationMinutes,
  0
)

export function TestInfo() {
  return (
    <Card>
      <CardContent className="flex flex-col gap-6">
        <dl className="flex flex-col divide-y divide-border border-y border-border">
          {SECTION_ORDER.map((section, index) => {
            const config = SECTION_CONFIG[section]
            return (
              <div key={section} className="flex flex-col gap-1 py-3">
                <div className="flex items-center justify-between gap-4">
                  <dt className="flex items-center gap-2 font-medium text-foreground">
                    <span className="font-mono text-xs text-muted-foreground">
                      {index + 1}
                    </span>
                    {config.label}
                  </dt>
                  <dd className="shrink-0 font-mono text-sm tabular-nums text-muted-foreground">
                    {config.questionCount} soal · {config.durationMinutes} mnt
                  </dd>
                </div>
                <ul className="ml-6 list-disc text-sm text-muted-foreground">
                  {config.instructions.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            )
          })}
          <div className="flex items-center justify-between gap-4 py-3 font-semibold">
            <dt className="text-foreground">Total</dt>
            <dd className="shrink-0 font-mono text-sm tabular-nums text-foreground">
              {totalQuestions} soal · {totalMinutes} mnt
            </dd>
          </div>
        </dl>

        <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Sebelum mulai</p>
          <ul className="mt-2 list-disc pl-5">
            <li>Tes berjalan dalam mode layar penuh hingga selesai.</li>
            <li>Setiap seksi punya timer; saat habis otomatis lanjut.</li>
            <li>Urutan seksi satu arah — tidak bisa kembali ke seksi sebelumnya.</li>
            <li>Keluar layar penuh atau menekan pintasan dapat dianggap pelanggaran.</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
