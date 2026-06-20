"use server"

import { revalidatePath } from "next/cache"

import { createAdminClient, createClient } from "@/lib/supabase/server"
import { joinSessionSchema, sessionFormSchema } from "@/lib/validations/session"
import { getSessionParticipants } from "@/server/queries/sessions"
import {
  type CreateSessionResult,
  type JoinSessionData,
  type ParticipantResult,
  type SessionFormData,
} from "@/types/session"
import { type ActionResult } from "@/types/auth"

const SESSIONS_PATH = "/admin/sessions"
const STUDENT_SESSIONS_PATH = "/sessions"

// Unambiguous alphabet (no 0/O/1/I) so codes are easy to read out and type.
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"
const CODE_LENGTH = 6

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>

function randomCode(length = CODE_LENGTH): string {
  let code = ""
  for (let i = 0; i < length; i += 1) {
    code += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)]
  }
  return code
}

/** Generate a code not already used by an existing session (retry on clash). */
async function generateUniqueInviteCode(
  supabase: SupabaseServerClient
): Promise<string | null> {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const code = randomCode()
    const { data } = await supabase
      .from("sessions")
      .select("id")
      .eq("invite_code", code)
      .maybeSingle()
    if (!data) return code
  }
  return null
}

/** Resolve a logged-in admin, or an error message. */
async function requireAdmin(
  supabase: SupabaseServerClient
): Promise<{ ok: true; userId: string } | { ok: false; message: string }> {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, message: "Sesi berakhir. Silakan masuk kembali." }

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle()
  if (profile?.role !== "admin") return { ok: false, message: "Akses ditolak." }

  return { ok: true, userId: user.id }
}

/** Convert validated form values into a DB-ready row payload. */
function toSessionRow(values: SessionFormData) {
  const maxParticipants =
    values.max_participants && values.max_participants !== ""
      ? Number(values.max_participants)
      : null

  return {
    title: values.title,
    description: values.description ? values.description : null,
    program_study: values.program_study ? values.program_study : null,
    faculty: values.faculty ? values.faculty : null,
    start_date: new Date(values.start_date).toISOString(),
    end_date: new Date(values.end_date).toISOString(),
    max_participants: maxParticipants,
    is_active: values.is_active,
  }
}

// ---------------------------------------------------------------------------
// Create
// ---------------------------------------------------------------------------
export async function createSessionAction(
  data: SessionFormData
): Promise<CreateSessionResult> {
  const parsed = sessionFormSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, message: "Data sesi tidak valid." }
  }

  const supabase = await createClient()
  const admin = await requireAdmin(supabase)
  if (!admin.ok) return { success: false, message: admin.message }

  const inviteCode = await generateUniqueInviteCode(supabase)
  if (!inviteCode) {
    return { success: false, message: "Gagal membuat kode undangan. Coba lagi." }
  }

  const { error } = await supabase.from("sessions").insert({
    ...toSessionRow(parsed.data),
    invite_code: inviteCode,
    created_by: admin.userId,
  })

  if (error) return { success: false, message: error.message }

  revalidatePath(SESSIONS_PATH)
  return {
    success: true,
    message: `Sesi dibuat. Kode undangan: ${inviteCode}`,
    inviteCode,
  }
}

// ---------------------------------------------------------------------------
// Update
// ---------------------------------------------------------------------------
export async function updateSessionAction(
  id: string,
  data: SessionFormData
): Promise<ActionResult> {
  if (!id) return { success: false, message: "Sesi tidak ditemukan." }

  const parsed = sessionFormSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, message: "Data sesi tidak valid." }
  }

  const supabase = await createClient()
  const admin = await requireAdmin(supabase)
  if (!admin.ok) return { success: false, message: admin.message }

  const { error } = await supabase
    .from("sessions")
    .update(toSessionRow(parsed.data))
    .eq("id", id)

  if (error) return { success: false, message: error.message }

  revalidatePath(SESSIONS_PATH)
  return { success: true, message: "Sesi berhasil diperbarui." }
}

// ---------------------------------------------------------------------------
// Delete
// ---------------------------------------------------------------------------
export async function deleteSessionAction(id: string): Promise<ActionResult> {
  if (!id) return { success: false, message: "Sesi tidak ditemukan." }

  const supabase = await createClient()
  const admin = await requireAdmin(supabase)
  if (!admin.ok) return { success: false, message: admin.message }

  const { error } = await supabase.from("sessions").delete().eq("id", id)
  if (error) return { success: false, message: error.message }

  revalidatePath(SESSIONS_PATH)
  return { success: true, message: "Sesi berhasil dihapus." }
}

// ---------------------------------------------------------------------------
// Lazy-load participants + results for the admin results dialog / export.
// ---------------------------------------------------------------------------
export async function getSessionParticipantsAction(sessionId: string): Promise<
  | { success: true; participants: ParticipantResult[] }
  | { success: false; message: string }
> {
  if (!sessionId) {
    return { success: false, message: "Sesi tidak ditemukan." }
  }

  const supabase = await createClient()
  const admin = await requireAdmin(supabase)
  if (!admin.ok) return { success: false, message: admin.message }

  try {
    const participants = await getSessionParticipants(sessionId)
    return { success: true, participants }
  } catch {
    return { success: false, message: "Gagal memuat daftar peserta." }
  }
}

// ---------------------------------------------------------------------------
// Join (student, by invite code)
// ---------------------------------------------------------------------------
export async function joinSessionAction(
  data: JoinSessionData
): Promise<ActionResult> {
  const parsed = joinSessionSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, message: "Kode undangan tidak valid." }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: "Sesi berakhir. Silakan masuk kembali." }
  }

  // Look the code up with the service-role client so students never need read
  // access to every session (RLS only exposes sessions they already joined).
  const admin = await createAdminClient()
  const { data: session } = await admin
    .from("sessions")
    .select("id, is_active, max_participants")
    .eq("invite_code", parsed.data.invite_code)
    .maybeSingle()

  if (!session) {
    return { success: false, message: "Kode undangan tidak ditemukan." }
  }
  if (!session.is_active) {
    return { success: false, message: "Sesi ini sudah tidak aktif." }
  }

  // Already a member? Treat as success so the UI just refreshes the list.
  const { data: existing } = await admin
    .from("session_participants")
    .select("id")
    .eq("session_id", session.id)
    .eq("user_id", user.id)
    .maybeSingle()
  if (existing) {
    return { success: true, message: "Anda sudah tergabung di sesi ini." }
  }

  // Enforce the optional capacity limit.
  if (session.max_participants != null) {
    const { count } = await admin
      .from("session_participants")
      .select("id", { count: "exact", head: true })
      .eq("session_id", session.id)
    if ((count ?? 0) >= session.max_participants) {
      return { success: false, message: "Kuota peserta sesi sudah penuh." }
    }
  }

  // Insert through the student's own client so RLS verifies user_id = auth.uid().
  const { error } = await supabase
    .from("session_participants")
    .insert({ session_id: session.id, user_id: user.id })

  if (error) return { success: false, message: error.message }

  revalidatePath(STUDENT_SESSIONS_PATH)
  return { success: true, message: "Berhasil bergabung ke sesi." }
}
