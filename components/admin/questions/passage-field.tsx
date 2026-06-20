"use client"

import { useFormContext, useWatch } from "react-hook-form"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { type PassageRow, type QuestionFormData } from "@/types/question"

interface PassageFieldProps {
  passages: PassageRow[]
}

/** Reading-only: choose an existing passage or write a new one inline. */
export function PassageField({ passages }: PassageFieldProps) {
  const { control } = useFormContext<QuestionFormData>()
  const mode = useWatch({ control, name: "passage_mode" })

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border p-4">
      <FormField
        control={control}
        name="passage_mode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Passage bacaan</FormLabel>
            <RadioGroup
              value={field.value}
              onValueChange={field.onChange}
              className="flex flex-row gap-6"
            >
              <label className="flex items-center gap-2 text-sm">
                <RadioGroupItem value="existing" />
                Pilih yang ada
              </label>
              <label className="flex items-center gap-2 text-sm">
                <RadioGroupItem value="new" />
                Buat baru
              </label>
            </RadioGroup>
            <FormMessage />
          </FormItem>
        )}
      />

      {mode === "existing" ? (
        <FormField
          control={control}
          name="passage_id"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih passage…" />
                  </SelectTrigger>
                  <SelectContent>
                    {passages.length === 0 ? (
                      <div className="px-2 py-3 text-sm text-muted-foreground">
                        Belum ada passage. Pilih “Buat baru”.
                      </div>
                    ) : (
                      passages.map((passage) => (
                        <SelectItem key={passage.id} value={passage.id}>
                          {passage.title}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ) : (
        <div className="flex flex-col gap-4">
          <FormField
            control={control}
            name="passage_title"
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
            control={control}
            name="passage_content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Isi passage</FormLabel>
                <FormControl>
                  <Textarea
                    rows={6}
                    placeholder="Tempel teks bacaan lengkap di sini…"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  )
}
