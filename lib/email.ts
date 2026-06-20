import { Resend } from "resend"

interface SendEmailInput {
  to: string
  subject: string
  html: string
}

/**
 * Send an email via Resend. Best-effort: no-op when RESEND_API_KEY is unset,
 * and never throws so it can't break the triggering action.
 */
export async function sendEmail(input: SendEmailInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return

  try {
    const resend = new Resend(apiKey)
    await resend.emails.send({
      from: process.env.RESEND_FROM ?? "PTESOL <onboarding@resend.dev>",
      to: input.to,
      subject: input.subject,
      html: input.html,
    })
  } catch {
    // Email is non-critical; ignore failures.
  }
}
