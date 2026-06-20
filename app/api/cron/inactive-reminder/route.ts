import { createAdminClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/email"

const INACTIVE_DAYS = 3

/**
 * Scheduled reminder for students who haven't signed in for 3+ days.
 * Protect with CRON_SECRET; invoke via Vercel Cron (see vercel.json) or any
 * scheduler (e.g. Supabase pg_cron) sending `Authorization: Bearer <secret>`.
 *
 * Note: session-related reminders ("sesi baru", "sesi segera berakhir") arrive
 * once the admin Sessions feature exists.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 })
  }

  const supabase = await createAdminClient()

  const { data: students } = await supabase
    .from("users")
    .select("id")
    .eq("role", "student")
  const studentIds = new Set((students ?? []).map((student) => student.id))
  if (studentIds.size === 0) return Response.json({ sent: 0 })

  const { data: list } = await supabase.auth.admin.listUsers()
  const threshold = Date.now() - INACTIVE_DAYS * 24 * 60 * 60 * 1000
  let sent = 0

  for (const authUser of list?.users ?? []) {
    if (!studentIds.has(authUser.id)) continue
    const lastSignIn = authUser.last_sign_in_at
      ? new Date(authUser.last_sign_in_at).getTime()
      : 0
    if (lastSignIn >= threshold) continue

    await supabase.from("notifications").insert({
      user_id: authUser.id,
      type: "reminder",
      title: "Sudah lama tidak berlatih",
      message: "Yuk lanjut latihan TOEFL ITP Anda agar skor makin meningkat!",
    })
    if (authUser.email) {
      await sendEmail({
        to: authUser.email,
        subject: "Ayo lanjut latihan TOEFL ITP",
        html: "<p>Sudah beberapa hari Anda tidak login. Yuk lanjutkan latihan TOEFL ITP Anda di PTESOL!</p>",
      })
    }
    sent++
  }

  return Response.json({ sent })
}
