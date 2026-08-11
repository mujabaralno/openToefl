import { Check, Clock3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

const OPTIONS = [
  "Bentuk lembah yang dihasilkan",
  "Kecepatan pergerakan air",
  "Suhu material yang dipindahkan",
];

export function PreviewSection() {
  return (
    <section id="simulation" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Format tes</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Satu layar untuk passage dan jawaban.
          </h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-muted-foreground">
          Timer, nomor soal, dan progress tetap terlihat saat Anda mengerjakan setiap bagian.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-4 border-b border-border bg-muted/30 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-md border border-border bg-card text-sm font-semibold">
              02
            </span>
            <div>
              <p className="text-sm font-medium">Reading section</p>
              <p className="text-xs text-muted-foreground">Question 12 of 50</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock3 className="size-4" aria-hidden="true" />
              <span className="font-mono text-foreground">14:32</span>
            </div>
            <Badge variant="secondary">In progress</Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
          <article className="p-6 sm:p-8 lg:border-r lg:border-border">
            <div className="mb-5 flex items-center justify-between text-xs text-muted-foreground">
              <span>Passage 1</span>
              <span>Reading</span>
            </div>
            <h3 className="text-xl font-semibold tracking-tight">The Impact of Glacial Erosion</h3>
            <Separator className="my-5" />
            <div className="space-y-4 text-sm leading-7 text-muted-foreground">
              <p>
                Glacial erosion shapes the landscape as a glacier moves across the ground. The
                process creates broad, U-shaped valleys that differ from the V-shaped valleys made
                by rivers.
              </p>
              <p>
                Two mechanisms drive this change: plucking removes pieces of rock, while abrasion
                smooths the surface beneath the ice.
              </p>
            </div>
          </article>

          <div className="bg-muted/20 p-6 sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <p className="text-sm font-medium">Menurut paragraf 1, apa perbedaan utamanya?</p>
              <span className="shrink-0 text-xs text-muted-foreground">1 poin</span>
            </div>
            <div className="space-y-3">
              {OPTIONS.map((option, index) => {
                const selected = index === 0;
                return (
                  <div
                    key={option}
                    className={
                      selected
                        ? "flex items-center gap-3 rounded-lg border border-primary bg-primary/5 p-4"
                        : "flex items-center gap-3 rounded-lg border border-border bg-card p-4"
                    }
                  >
                    <span
                      className={
                        selected
                          ? "flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
                          : "flex size-5 shrink-0 items-center justify-center rounded-full border border-border text-xs text-muted-foreground"
                      }
                    >
                      {selected ? (
                        <Check className="size-3" aria-hidden="true" />
                      ) : (
                        String.fromCharCode(65 + index)
                      )}
                    </span>
                    <span className={selected ? "text-sm font-medium" : "text-sm text-muted-foreground"}>
                      {option}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress simulasi</span>
                <span>24%</span>
              </div>
              <Progress value={24} aria-label="Progress simulasi 24 persen" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
