"use client"

import * as React from "react"
import { toast } from "sonner"
import { Upload, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface AudioUploadFieldProps {
  /** Current audio URL (signed) stored on the form. */
  value: string
  onChange: (url: string) => void
}

const MAX_BYTES = 5 * 1024 * 1024 // 5MB

interface UploadResponse {
  signedUrl?: string
  error?: string
}

function validate(file: File): string | null {
  const isMp3 =
    file.type === "audio/mpeg" ||
    file.type === "audio/mp3" ||
    file.name.toLowerCase().endsWith(".mp3")
  if (!isMp3) return "Hanya file .mp3 yang diizinkan."
  if (file.size > MAX_BYTES) return "Ukuran file maksimal 5MB."
  return null
}

export function AudioUploadField({ value, onChange }: AudioUploadFieldProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = React.useState(false)
  const [progress, setProgress] = React.useState(0)

  function handleFile(file: File) {
    const error = validate(file)
    if (error) {
      toast.error(error)
      return
    }

    setUploading(true)
    setProgress(0)

    const xhr = new XMLHttpRequest()
    xhr.open("POST", "/api/admin/audio")

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        setProgress(Math.round((event.loaded / event.total) * 100))
      }
    }

    xhr.onload = () => {
      setUploading(false)
      let body: UploadResponse = {}
      try {
        body = JSON.parse(xhr.responseText) as UploadResponse
      } catch {
        body = {}
      }
      if (xhr.status >= 200 && xhr.status < 300 && body.signedUrl) {
        onChange(body.signedUrl)
        toast.success("Audio berhasil diunggah.")
      } else {
        toast.error(body.error ?? "Gagal mengunggah audio.")
      }
    }

    xhr.onerror = () => {
      setUploading(false)
      toast.error("Gagal mengunggah audio. Periksa koneksi Anda.")
    }

    const formData = new FormData()
    formData.append("file", file)
    xhr.send(formData)
  }

  function onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) handleFile(file)
    // Reset so selecting the same file again re-triggers change.
    event.target.value = ""
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={inputRef}
        type="file"
        accept=".mp3,audio/mpeg"
        className="sr-only"
        onChange={onInputChange}
      />

      {value && !uploading && (
        <div className="flex flex-col gap-2 rounded-lg border border-border p-3">
          <audio controls src={value} className="w-full">
            Browser Anda tidak mendukung pemutar audio.
          </audio>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
            >
              <Upload />
              Ganti audio
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange("")}
            >
              <X />
              Hapus
            </Button>
          </div>
        </div>
      )}

      {uploading && (
        <div className="flex flex-col gap-2 rounded-lg border border-border p-3">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Mengunggah…</span>
            <span className="font-mono tabular-nums">{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>
      )}

      {!value && !uploading && (
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
          className="w-fit"
        >
          <Upload />
          Unggah file MP3
        </Button>
      )}
    </div>
  )
}
