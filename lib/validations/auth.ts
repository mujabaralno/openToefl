import { z } from "zod"

// ---------------------------------------------------------------------------
// Register
// ---------------------------------------------------------------------------
export const registerSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .max(72, "Password maksimal 72 karakter"),
  full_name: z
    .string()
    .min(1, "Nama lengkap wajib diisi")
    .max(255, "Nama terlalu panjang"),
  student_id: z
    .string()
    .min(1, "NIM wajib diisi")
    .max(50, "NIM terlalu panjang"),
  program_study: z
    .string()
    .min(1, "Program studi wajib diisi")
    .max(100, "Program studi terlalu panjang"),
})

export type RegisterFormData = z.infer<typeof registerSchema>

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
})

export type LoginFormData = z.infer<typeof loginSchema>

// ---------------------------------------------------------------------------
// Forgot Password
// ---------------------------------------------------------------------------
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
})

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

// ---------------------------------------------------------------------------
// Reset Password
// ---------------------------------------------------------------------------
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password minimal 8 karakter")
      .max(72, "Password maksimal 72 karakter"),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  })

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
