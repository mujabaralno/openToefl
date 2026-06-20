"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { passageFormSchema } from "@/lib/validations/passage"
import {
  createPassageAction,
  updatePassageAction,
} from "@/server/actions/passages"
import { type PassageFormData } from "@/types/passage"

interface PassageFormProps {
  mode: "create" | "edit"
  passageId?: string
  defaultValues: PassageFormData
  onSuccess: () => void
  onCancel: () => void
}

export function PassageForm({
  mode,
  passageId,
  defaultValues,
  onSuccess,
  onCancel,
}: PassageFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  const form = useForm<PassageFormData>({
    resolver: zodResolver(passageFormSchema),
    defaultValues,
  })

  function onSubmit(values: PassageFormData) {
    startTransition(async () => {
      try {
        const result =
          mode === "edit" && passageId
            ? await updatePassageAction(passageId, values)
            : await createPassageAction(values)

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
              <FormLabel>Judul passage</FormLabel>
              <FormControl>
                <Input placeholder="mis. The History of Coffee" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Isi passage</FormLabel>
              <FormControl>
                <Textarea
                  rows={12}
                  placeholder="Tempel teks bacaan lengkap di sini…"
                  {...field}
                />
              </FormControl>
              <FormMessage />
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
                : "Tambah passage"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
