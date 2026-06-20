"use server"

import { revalidatePath } from "next/cache"

import { createClient } from "@/lib/supabase/server"
import { getUserAttempts } from "@/server/queries/users"
import { createNotification } from "@/server/notifications"
import { sendEmail } from "@/lib/email"
import type { ActionResult } from "@/types/auth"
import type { UserAttemptsResult } from "@/types/user"

const USERS_PATH = "/admin/users"

/**
 * Set an account's lock state. With the `is_locked`-only model this single
 * action serves three UI intents:
 *  - unlock (anti-cheat)     → locked = false
 *  - re-activate a disabled  → locked = false
 *  - deactivate an account   → locked = true (permanent, locked_until = null)
 */
export async function setUserLockAction(
  userId: string,
  locked: boolean
): Promise<ActionResult> {
  if (!userId) return { success: false, message: "Pengguna tidak ditemukan." }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: "Sesi berakhir. Silakan masuk kembali." }
  }
  if (user.id === userId) {
    return { success: false, message: "Tidak bisa mengubah status akun sendiri." }
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle()
  if (profile?.role !== "admin") {
    return { success: false, message: "Akses ditolak." }
  }

  const { error } = await supabase
    .from("users")
    .update({ is_locked: locked, locked_until: null })
    .eq("id", userId)

  if (error) return { success: false, message: error.message }

  // Notify the affected user (in-app always; email when re-activated).
  if (locked) {
    await createNotification({
      userId,
      type: "account_locked",
      title: "Akun dinonaktifkan",
      message: "Akun Anda dinonaktifkan oleh admin. Hubungi admin untuk info.",
    })
  } else {
    await createNotification({
      userId,
      type: "account_unlocked",
      title: "Akun diaktifkan",
      message:
        "Akun Anda telah diaktifkan kembali. Anda bisa mengikuti tes lagi.",
    })
    const { data: target } = await supabase
      .from("users")
      .select("email, full_name")
      .eq("id", userId)
      .maybeSingle()
    if (target?.email) {
      await sendEmail({
        to: target.email,
        subject: "Akun PTESOL Anda telah diaktifkan",
        html: `<p>Halo ${target.full_name ?? "Mahasiswa"},</p><p>Akun PTESOL Anda telah diaktifkan kembali. Anda dapat mengikuti tes lagi.</p>`,
      })
    }
  }

  revalidatePath(USERS_PATH)
  return {
    success: true,
    message: locked ? "Akun dinonaktifkan." : "Akun diaktifkan kembali.",
  }
}

/** Lazy-load a user's test attempts for the history dialog. */
export async function getUserAttemptsAction(
  userId: string
): Promise<UserAttemptsResult> {
  if (!userId) {
    return { success: false, message: "Pengguna tidak ditemukan.", attempts: [] }
  }
  try {
    const attempts = await getUserAttempts(userId)
    return { success: true, attempts }
  } catch {
    return { success: false, message: "Gagal memuat riwayat tes.", attempts: [] }
  }
}
