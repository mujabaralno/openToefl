"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

interface InviteCodeProps {
  code: string
}

/** Monospace invite code with a one-click copy-to-clipboard button. */
export function InviteCode({ code }: InviteCodeProps) {
  const [copied, setCopied] = React.useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      toast.success("Kode undangan disalin.")
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      toast.error("Gagal menyalin kode.")
    }
  }

  return (
    <div className="flex items-center gap-1">
      <code className="rounded bg-muted px-2 py-1 font-mono text-sm tracking-widest tabular-nums">
        {code}
      </code>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={`Salin kode undangan ${code}`}
        onClick={copy}
      >
        {copied ? <Check /> : <Copy />}
      </Button>
    </div>
  )
}
