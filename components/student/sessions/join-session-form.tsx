"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { LogIn } from "lucide-react"

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
import { joinSessionSchema } from "@/lib/validations/session"
import { joinSessionAction } from "@/server/actions/sessions"
import { type JoinSessionData } from "@/types/session"

export function JoinSessionForm() {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  const form = useForm<JoinSessionData>({
    resolver: zodResolver(joinSessionSchema),
    defaultValues: { invite_code: "" },
  })

  function onSubmit(values: JoinSessionData) {
    startTransition(async () => {
      try {
        const result = await joinSessionAction(values)
        if (result.success) {
          toast.success(result.message)
          form.reset()
          router.refresh()
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <FormField
          control={form.control}
          name="invite_code"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Kode undangan</FormLabel>
              <FormControl>
                <Input
                  placeholder="mis. AB3K9P"
                  autoCapitalize="characters"
                  className="font-mono tracking-widest uppercase"
                  maxLength={10}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending} className="shrink-0">
          <LogIn />
          {isPending ? "Bergabung…" : "Gabung"}
        </Button>
      </form>
    </Form>
  )
}
