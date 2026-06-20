"use client"

import * as React from "react"
import { RefreshCw, Sparkles } from "lucide-react"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Response } from "@/components/ai-elements/response"

interface AiAnalysisSectionProps {
  attemptId: string
  /** Saved Markdown analysis, or null to stream a fresh one. */
  initialMarkdown: string | null
}

export function AiAnalysisSection({
  attemptId,
  initialMarkdown,
}: AiAnalysisSectionProps) {
  const [text, setText] = React.useState(initialMarkdown ?? "")
  const [streaming, setStreaming] = React.useState(initialMarkdown === null)
  const [error, setError] = React.useState<string | null>(null)
  const startedRef = React.useRef(false)

  const runStream = React.useCallback(async () => {
    try {
      const response = await fetch("/api/ai-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attemptId }),
      })
      if (!response.ok || !response.body) {
        const message = await response.text().catch(() => "")
        setError(message || "Gagal memuat analisis AI.")
        setStreaming(false)
        return
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ""
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        setText(accumulated)
      }
      setStreaming(false)
    } catch {
      setError("Terjadi kesalahan sistem.")
      setStreaming(false)
    }
  }, [attemptId])

  // Auto-stream on first view when there's no saved analysis.
  React.useEffect(() => {
    if (initialMarkdown !== null || startedRef.current) return
    startedRef.current = true
    void runStream()
  }, [initialMarkdown, runStream])

  function regenerate() {
    setError(null)
    setText("")
    setStreaming(true)
    void runStream()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="size-4" aria-hidden="true" />
          Analisis AI
        </CardTitle>
        <CardDescription>
          Ringkasan performa, kelemahan, kekuatan, dan rekomendasi belajar.
        </CardDescription>
        {!streaming && (
          <CardAction>
            <Button variant="ghost" size="sm" onClick={regenerate}>
              <RefreshCw />
              Generate ulang
            </Button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        {streaming && text === "" ? (
          <div className="flex flex-col gap-2.5">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="size-4 animate-pulse" aria-hidden="true" />
              Sedang dianalisis…
            </p>
          </div>
        ) : text ? (
          <div className="flex flex-col gap-3">
            <Response>{text}</Response>
            {streaming && (
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="size-3 animate-pulse" aria-hidden="true" />
                Menulis…
              </p>
            )}
          </div>
        ) : error ? (
          <div className="flex flex-col items-start gap-3">
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button variant="outline" size="sm" onClick={regenerate}>
              <RefreshCw />
              Coba lagi
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
