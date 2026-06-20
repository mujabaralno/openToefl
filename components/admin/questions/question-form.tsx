"use client"

import * as React from "react"
import { useForm, useWatch } from "react-hook-form"
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
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AnswerOptionsField } from "@/components/admin/questions/answer-options-field"
import { AudioUploadField } from "@/components/admin/questions/audio-upload-field"
import { ListeningGroupField } from "@/components/admin/questions/listening-group-field"
import { PassageField } from "@/components/admin/questions/passage-field"
import { questionFormSchema } from "@/lib/validations/question"
import {
  DIFFICULTIES,
  LISTENING_PARTS,
  QUESTION_SECTIONS,
} from "@/lib/validations/question"
import { difficultyLabels, listeningPartLabels, sectionLabels } from "@/lib/questions"
import {
  createQuestionAction,
  updateQuestionAction,
} from "@/server/actions/questions"
import {
  type PassageRow,
  type QuestionFormData,
  type QuestionSection,
} from "@/types/question"
import { type ListeningGroupRow } from "@/types/listening"

interface QuestionFormProps {
  mode: "create" | "edit"
  questionId?: string
  defaultValues: QuestionFormData
  passages: PassageRow[]
  listeningGroups: ListeningGroupRow[]
  onSuccess: () => void
  onCancel: () => void
}

function questionTextLabel(section: QuestionSection): string {
  if (section === "structure") return "Kalimat rumpang"
  return "Teks soal"
}

export function QuestionForm({
  mode,
  questionId,
  defaultValues,
  passages,
  listeningGroups,
  onSuccess,
  onCancel,
}: QuestionFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  const form = useForm<QuestionFormData>({
    resolver: zodResolver(questionFormSchema),
    defaultValues,
  })

  const section = useWatch({ control: form.control, name: "section" })
  const listeningPart = useWatch({
    control: form.control,
    name: "listening_part",
  })

  const groupsForPart = React.useMemo(
    () => listeningGroups.filter((group) => group.part === listeningPart),
    [listeningGroups, listeningPart]
  )

  function onSubmit(values: QuestionFormData) {
    startTransition(async () => {
      try {
        const result =
          mode === "edit" && questionId
            ? await updateQuestionAction(questionId, values)
            : await createQuestionAction(values)

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
          name="section"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seksi</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {QUESTION_SECTIONS.map((value) => (
                      <SelectItem key={value} value={value}>
                        {sectionLabels[value]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {section === "reading" && <PassageField passages={passages} />}

        <FormField
          control={form.control}
          name="question_text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{questionTextLabel(section)}</FormLabel>
              <FormControl>
                <Textarea
                  rows={3}
                  placeholder={
                    section === "structure"
                      ? "mis. The committee ___ to meet every Friday."
                      : "Tulis pertanyaan di sini…"
                  }
                  {...field}
                />
              </FormControl>
              {section === "structure" && (
                <FormDescription>
                  Gunakan garis bawah untuk menandai bagian yang rumpang.
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {section === "listening" && (
          <>
            <FormField
              control={form.control}
              name="listening_part"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Part</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value ?? "A"}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LISTENING_PARTS.map((value) => (
                          <SelectItem key={value} value={value}>
                            {listeningPartLabels[value]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="audio_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Audio soal (MP3)</FormLabel>
                  <FormControl>
                    <AudioUploadField
                      value={field.value ?? ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    {listeningPart === "A"
                      ? "File .mp3 maksimal 5MB, diputar sekali."
                      : "Soal ke-1: rekaman percakapan penuh + pertanyaannya. Soal berikutnya: hanya pertanyaannya."}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {listeningPart !== "A" && (
              <ListeningGroupField groups={groupsForPart} />
            )}
          </>
        )}

        <AnswerOptionsField />

        <FormField
          control={form.control}
          name="explanation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Penjelasan (opsional)</FormLabel>
              <FormControl>
                <Textarea
                  rows={2}
                  placeholder="Jelaskan mengapa jawaban ini benar…"
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
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tingkat kesulitan</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DIFFICULTIES.map((value) => (
                        <SelectItem key={value} value={value}>
                          {difficultyLabels[value]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Aktif</SelectItem>
                      <SelectItem value="inactive">Nonaktif</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
                : "Tambah soal"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
