import { randomUUID } from "node:crypto"
import { NextResponse } from "next/server"

import { createClient } from "@/lib/supabase/server"

const MAX_BYTES = 5 * 1024 * 1024 // 5MB
// Long-lived signed URL stored alongside the question. The audio bucket stays
// private; we never expose a public URL.
const SIGNED_URL_TTL_SECONDS = 60 * 60 * 24 * 365 // 1 year

function isMp3(file: File): boolean {
  return (
    file.type === "audio/mpeg" ||
    file.type === "audio/mp3" ||
    file.name.toLowerCase().endsWith(".mp3")
  )
}

export async function POST(request: Request) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Sesi berakhir." }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle()
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 403 })
  }

  const formData = await request.formData()
  const file = formData.get("file")
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File tidak ditemukan." }, { status: 400 })
  }
  if (!isMp3(file)) {
    return NextResponse.json(
      { error: "Hanya file .mp3 yang diizinkan." },
      { status: 400 }
    )
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Ukuran file maksimal 5MB." },
      { status: 400 }
    )
  }

  const path = `listening/${randomUUID()}.mp3`

  const { error: uploadError } = await supabase.storage
    .from("audio")
    .upload(path, file, { contentType: "audio/mpeg", upsert: false })
  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const { data: signed, error: signError } = await supabase.storage
    .from("audio")
    .createSignedUrl(path, SIGNED_URL_TTL_SECONDS)
  if (signError || !signed) {
    return NextResponse.json(
      { error: "Gagal membuat signed URL." },
      { status: 500 }
    )
  }

  return NextResponse.json({ path, signedUrl: signed.signedUrl })
}
