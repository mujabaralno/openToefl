"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { sessionFormSchema } from "@/lib/validations/session"
import {
  createSessionAction,
  updateSessionAction,
} from "@/server/actions/sessions"
import { type SessionFormData } from "@/types/session"

interface SessionFormProps {
  mode: "create" | "edit"
  sessionId?: string
  defaultValues: SessionFormData
  onSuccess: () => void
  onCancel: () => void
}

export function SessionForm({
  mode,
  sessionId,
  defaultValues,
  onSuccess,
  onCancel,
}: SessionFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  const form = useForm<SessionFormData>({
    resolver: zodResolver(sessionFormSchema),
    defaultValues,
  })

  function onSubmit(values: SessionFormData) {
    startTransition(async () => {
      try {
        const result =
          mode === "edit" && sessionId
            ? await updateSessionAction(sessionId, values)
            : await createSessionAction(values)

        if (result.success) {
          toast.success(result.message)
          router.refresh()
          onSuccess()
        } else {
          toast.error(result.message)
        }
      } catch {
        toast.error("Terjadi kesalahan sistem.")
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Judul sesi</FormLabel>
              <FormControl>
                <Input
                  placeholder="mis. TOEFL Batch Informatika — Genap 2026"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi (opsional)</FormLabel>
              <FormControl>
                <Textarea
                  rows={2}
                  placeholder="Keterangan tambahan tentang sesi ini…"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="program_study"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Program studi (opsional)</FormLabel>
                <FormControl>
                  <Input placeholder="mis. Teknik Informatika" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="faculty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fakultas (opsional)</FormLabel>
                <FormControl>
                  <Input placeholder="mis. Fakultas Teknik" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tanggal mulai</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tanggal selesai</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="max_participants"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maks peserta (opsional)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  inputMode="numeric"
                  placeholder="Kosongkan untuk tanpa batas"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Biarkan kosong jika tidak ada batas jumlah peserta.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border border-border p-3">
              <div className="space-y-0.5">
                <FormLabel>Sesi aktif</FormLabel>
                <FormDescription>
                  Hanya sesi aktif yang bisa dijoin mahasiswa via kode.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  aria-label="Status aktif sesi"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="-mx-4 -mb-4 flex flex-col-reverse gap-2 border-t bg-muted/50 p-4 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
          >
            Batal
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending
              ? "Menyimpan…"
              : mode === "edit"
                ? "Simpan perubahan"
                : "Buat sesi"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
