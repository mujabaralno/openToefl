/**
 * types/passage.ts
 * Passage form type derived from the Zod schema. The DB row alias `PassageRow`
 * lives in types/question.ts (single source) — import it from there.
 */

import type { z } from "zod"
import type { passageFormSchema } from "@/lib/validations/passage"

export type PassageFormData = z.infer<typeof passageFormSchema>
