import { z } from "zod"

import { QUESTION_SECTIONS } from "@/lib/validations/question"

export const practiceSetupSchema = z.object({
  section: z.enum(QUESTION_SECTIONS),
  count: z.number().int().min(1, "Minimal 1 soal").max(50, "Maksimal 50 soal"),
  timer: z.boolean(),
})
