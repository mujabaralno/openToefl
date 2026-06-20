/**
 * types/settings.ts
 */

import type { z } from "zod"
import type {
  profileSchema,
  passwordSchema,
  THEMES,
  LANGUAGES,
} from "@/lib/validations/settings"
import type { Tables } from "@/types/database.types"

export type UserSettingsRow = Tables<"user_settings">

export type ThemePreference = (typeof THEMES)[number]
export type LanguagePreference = (typeof LANGUAGES)[number]

export type ProfileFormData = z.infer<typeof profileSchema>
export type PasswordFormData = z.infer<typeof passwordSchema>
