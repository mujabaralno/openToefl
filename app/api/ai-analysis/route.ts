import { streamText } from "ai"
import { groq } from "@ai-sdk/groq"

import { createClient } from "@/lib/supabase/server"
import { GROQ_DEFAULT_MODEL, SYSTEM_PROMPT, buildPrompt } from "@/lib/ai"

/**
 * Streams the AI analysis for a completed simulation as Markdown text, and
 * persists it to ai_analyses when the stream finishes.
 */
export async function POST(request: Request) {
  const { attemptId } = (await request.json()) as { attemptId?: string }
  if (!attemptId) {
    return new Response("Tes tidak ditemukan.", { status: 400 })
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return new Response("Sesi berakhir. Silakan masuk kembali.", {
      status: 401,
    })
  }

  const { data: attempt } = await supabase
    .from("test_attempts")
    .select("*")
    .eq("id", attemptId)
    .maybeSingle()
  if (!attempt || attempt.user_id !== user.id) {
    return new Response("Tes tidak ditemukan.", { status: 404 })
  }
  if (attempt.status !== "completed") {
    return new Response("Tes belum selesai.", { status: 400 })
  }

  if (!process.env.GROQ_API_KEY) {
    return new Response("AI belum dikonfigurasi (GROQ_API_KEY belum diatur).", {
      status: 503,
    })
  }

  const result = streamText({
    model: groq(GROQ_DEFAULT_MODEL),
    system: SYSTEM_PROMPT,
    prompt: buildPrompt(attempt),
    onFinish: async ({ text }) => {
      await supabase
        .from("ai_analyses")
        .delete()
        .eq("attempt_id", attemptId)
        .eq("user_id", user.id)
      await supabase.from("ai_analyses").insert({
        user_id: user.id,
        attempt_id: attemptId,
        analysis_type: "simulation",
        full_analysis: text,
        model_used: GROQ_DEFAULT_MODEL,
      })
    },
  })

  return result.toTextStreamResponse()
}
