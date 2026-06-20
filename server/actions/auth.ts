"use server"

import type { AuthError } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/server"
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/lib/validations/auth"
import {
  type RegisterFormData,
  type LoginFormData,
  type ForgotPasswordFormData,
  type ResetPasswordFormData,
} from "@/lib/validations/auth"
import { type ActionResult } from "@/types/auth"

/**
 * Helper to extract a user-friendly message from Supabase AuthError.
 */
function getAuthErrorMessage(error: AuthError): string {
  // Map common Supabase error messages to Indonesian
  const messageMap: Record<string, string> = {
    "Invalid login credentials": "Email atau password salah",
    "Email not confirmed": "Email belum dikonfirmasi. Cek inbox Anda.",
    "User already registered": "Email sudah terdaftar",
    "Password should be at least 6 characters":
      "Password minimal 6 karakter",
    "Email rate limit exceeded":
      "Terlalu banyak percobaan. Coba lagi nanti.",
    "For security purposes, you can only request this once every 60 seconds":
      "Untuk keamanan, Anda hanya bisa meminta ini setiap 60 detik.",
  }

  return messageMap[error.message] ?? error.message
}

// ---------------------------------------------------------------------------
// Register
// ---------------------------------------------------------------------------
export async function registerAction(
  data: RegisterFormData
): Promise<ActionResult> {
  const parsed = registerSchema.safeParse(data)
  if (!parsed.success) {
    return {
      success: false,
      message: "Data yang dikirim tidak valid",
    }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.full_name,
        student_id: parsed.data.student_id,
        program_study: parsed.data.program_study,
      },
    },
  })

  if (error) {
    return { success: false, message: getAuthErrorMessage(error) }
  }

  return {
    success: true,
    message:
      "Registrasi berhasil! Silakan cek email Anda untuk verifikasi akun.",
  }
}

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------
export async function loginAction(
  data: LoginFormData
): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(data)
  if (!parsed.success) {
    return {
      success: false,
      message: "Data yang dikirim tidak valid",
    }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) {
    return { success: false, message: getAuthErrorMessage(error) }
  }

  // Fetch user role to determine redirect destination
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: "Gagal mendapatkan data pengguna" }
  }

  // Query the public.users table for the role
  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single()

  const redirectTo =
    profile?.role === "admin" ? "/admin/dashboard" : "/dashboard"

  return {
    success: true,
    message: "Login berhasil!",
    redirectTo,
  }
}

// ---------------------------------------------------------------------------
// Forgot Password
// ---------------------------------------------------------------------------
export async function forgotPasswordAction(
  data: ForgotPasswordFormData
): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse(data)
  if (!parsed.success) {
    return {
      success: false,
      message: "Data yang dikirim tidak valid",
    }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(
    parsed.data.email,
    {
      redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL ? "" : ""}${typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/confirm?type=recovery`,
    }
  )

  if (error) {
    return { success: false, message: getAuthErrorMessage(error) }
  }

  // Always return success to prevent email enumeration
  return {
    success: true,
    message:
      "Jika email terdaftar, link reset password telah dikirim. Silakan cek inbox Anda.",
  }
}

// ---------------------------------------------------------------------------
// Reset Password
// ---------------------------------------------------------------------------
export async function resetPasswordAction(
  data: ResetPasswordFormData
): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse(data)
  if (!parsed.success) {
    return {
      success: false,
      message: "Data yang dikirim tidak valid",
    }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  })

  if (error) {
    return { success: false, message: getAuthErrorMessage(error) }
  }

  return {
    success: true,
    message: "Password berhasil diubah! Silakan login dengan password baru.",
    redirectTo: "/login",
  }
}

// ---------------------------------------------------------------------------
// Logout
// ---------------------------------------------------------------------------
export async function logoutAction(): Promise<ActionResult> {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    return { success: false, message: getAuthErrorMessage(error) }
  }

  return {
    success: true,
    message: "Logout berhasil",
    redirectTo: "/login",
  }
}
