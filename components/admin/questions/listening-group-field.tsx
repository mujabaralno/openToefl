"use client"

import { useFormContext, useWatch } from "react-hook-form"

import {
  FormControl,
  FormDescription,
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
import { type ListeningGroupRow } from "@/types/listening"
import { type QuestionFormData } from "@/types/question"

interface ListeningGroupFieldProps {
  /** Groups already filtered to the currently selected part (B or C). */
  groups: ListeningGroupRow[]
}

const ORDER_OPTIONS = [1, 2, 3, 4, 5, 6]

/**
 * Part B/C: bind this question to the conversation it belongs to (pick an
 * existing group or create one) and set its order. Audio is uploaded per
 * question above — not here.
 */
export function ListeningGroupField({ groups }: ListeningGroupFieldProps) {
  const { control } = useFormContext<QuestionFormData>()
  const mode = useWatch({ control, name: "group_mode" })

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border p-4">
      <FormField
        control={control}
        name="group_mode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Grup percakapan</FormLabel>
            <FormDescription>
              Satu percakapan/talk untuk beberapa soal. Audio percakapan ada di
              soal pertama grup.
            </FormDescription>
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
          name="group_id"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih grup percakapan…" />
                  </SelectTrigger>
                  <SelectContent>
                    {groups.length === 0 ? (
                      <div className="px-2 py-3 text-sm text-muted-foreground">
                        Belum ada grup untuk part ini. Pilih “Buat baru”.
                      </div>
                    ) : (
                      groups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.title || `Grup ${group.id.slice(0, 8)}`}
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
            name="group_title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Judul grup (opsional)</FormLabel>
                <FormControl>
                  <Input placeholder="mis. Conversation 1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="group_transcript"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transkrip percakapan (opsional)</FormLabel>
                <FormControl>
                  <Textarea
                    rows={4}
                    placeholder="Transkrip percakapan / talk untuk referensi…"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}

      <FormField
        control={control}
        name="order_in_group"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Urutan soal dalam grup</FormLabel>
            <FormControl>
              <Select
                value={String(field.value ?? 1)}
                onValueChange={(value) => field.onChange(Number(value))}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ORDER_OPTIONS.map((value) => (
                    <SelectItem key={value} value={String(value)}>
                      Soal ke-{value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormDescription>
              Soal ke-1 memuat audio percakapan penuh; berikutnya hanya
              pertanyaan.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
