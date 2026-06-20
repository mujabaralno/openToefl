import { z } from "zod"

export const THEMES = ["light", "dark", "system"] as const
export const LANGUAGES = ["id", "en"] as const

export const appearanceSchema = z.object({
  theme: z.enum(THEMES),
  language: z.enum(LANGUAGES),
})

export const notificationsSchema = z.object({
  email_notifications: z.boolean(),
  inapp_notifications: z.boolean(),
})

export const profileSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(1, "Nama wajib diisi")
    .max(255, "Nama terlalu panjang"),
  student_id: z.string().trim().max(50, "NIM terlalu panjang"),
  program_study: z.string().trim().max(100, "Program studi terlalu panjang"),
  avatar_url: z
    .union([z.string().trim().url("URL avatar tidak valid"), z.literal("")])
    .optional(),
})

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Password saat ini wajib diisi"),
    newPassword: z
      .string()
      .min(8, "Password minimal 8 karakter")
      .max(72, "Password maksimal 72 karakter"),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  })
