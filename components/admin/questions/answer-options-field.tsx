"use client"

import { useFormContext } from "react-hook-form"

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ANSWER_KEYS } from "@/lib/validations/question"
import { type QuestionFormData } from "@/types/question"

/**
 * The four answer options plus the "mark the key" radio in one block. Selecting
 * a radio sets `correct_answer`; the letter chip ties each option to its key.
 */
export function AnswerOptionsField() {
  const { control } = useFormContext<QuestionFormData>()

  return (
    <FormField
      control={control}
      name="correct_answer"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Opsi jawaban &amp; kunci</FormLabel>
          <FormDescription>
            Isi keempat opsi, lalu pilih lingkaran pada opsi yang benar.
          </FormDescription>
          <RadioGroup
            value={field.value}
            onValueChange={field.onChange}
            className="gap-2"
          >
            {ANSWER_KEYS.map((key) => (
              <div key={key} className="flex items-start gap-3">
                <RadioGroupItem
                  value={key}
                  id={`correct-${key}`}
                  aria-label={`Tandai opsi ${key} sebagai kunci jawaban`}
                  className="mt-2.5"
                />
                <FormField
                  control={control}
                  name={`options.${key}`}
                  render={({ field: optionField }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <label
                            htmlFor={`correct-${key}`}
                            className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted font-mono text-sm font-medium text-muted-foreground"
                          >
                            {key}
                          </label>
                          <Input
                            placeholder={`Opsi ${key}`}
                            aria-label={`Teks opsi ${key}`}
                            {...optionField}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </RadioGroup>
          {/* Error for the correct_answer cross-check */}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
