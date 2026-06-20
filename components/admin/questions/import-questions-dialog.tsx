"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Download, FileUp, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { downloadQuestionTemplate, parseQuestionsWorkbook } from "@/lib/excel"
import { importQuestionsAction } from "@/server/actions/question-import"
import { type ImportReport } from "@/types/question"

interface ImportQuestionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ImportQuestionsDialog({
  open,
  onOpenChange,
}: ImportQuestionsDialogProps) {
  const router = useRouter()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [isPending, startTransition] = React.useTransition()
  const [report, setReport] = React.useState<ImportReport | null>(null)

  function handleOpenChange(next: boolean) {
    if (!next) setReport(null)
    onOpenChange(next)
  }

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    // Reset the input so re-selecting the same file fires onChange again.
    event.target.value = ""
    if (!file) return

    let rows: unknown[]
    try {
      rows = await parseQuestionsWorkbook(file)
    } catch {
      toast.error("Gagal membaca file. Pastikan format .xlsx valid.")
      return
    }

    if (rows.length === 0) {
      toast.error("File kosong atau tidak ada baris data.")
      return
    }

    startTransition(async () => {
      try {
        const result = await importQuestionsAction(rows)
        setReport(result.report ?? null)
        if (result.success) {
          toast.success(result.message)
          router.refresh()
        } else {
          toast.error(result.message)
        }
      } catch {
        toast.error("Terjadi kesalahan saat mengimpor.")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Import soal dari Excel</DialogTitle>
          <DialogDescription>
            Unduh template, isi sesuai kolom, lalu unggah. Setiap baris
            divalidasi sebelum disimpan.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={downloadQuestionTemplate}
          >
            <Download />
            Unduh template
          </Button>

          <div className="flex flex-col gap-2">
            <Label htmlFor="import-file">File Excel (.xlsx)</Label>
            <Input
              id="import-file"
              ref={inputRef}
              type="file"
              accept=".xlsx,.xls"
              disabled={isPending}
              onChange={handleFile}
            />
          </div>

          {isPending && (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Memvalidasi &amp; menyimpan…
            </p>
          )}

          {report && (
            <div className="flex flex-col gap-3 rounded-lg border border-border p-3">
              <div className="flex items-center gap-2 text-sm">
                <FileUp className="size-4 text-muted-foreground" />
                <span>
                  {report.inserted} berhasil, {report.failed} gagal dari{" "}
                  {report.total} baris.
                </span>
              </div>

              {report.errors.length > 0 && (
                <div className="max-h-48 overflow-y-auto rounded-md bg-muted/40 p-2">
                  <ul className="flex flex-col gap-1.5 text-xs">
                    {report.errors.map((error) => (
                      <li key={error.row}>
                        <span className="font-mono font-medium text-foreground">
                          Baris {error.row}:
                        </span>{" "}
                        <span className="text-muted-foreground">
                          {error.messages.join("; ")}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
