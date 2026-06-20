"use server"

import { revalidatePath } from "next/cache"

import { createClient } from "@/lib/supabase/server"
import { passageFormSchema } from "@/lib/validations/passage"
import { type PassageFormData } from "@/types/passage"
import { type ActionResult } from "@/types/auth"

const PASSAGES_PATH = "/admin/passages"
const QUESTIONS_PATH = "/admin/questions"

function revalidate() {
  revalidatePath(PASSAGES_PATH)
  // Reading questions reference passages, so keep that page fresh too.
  revalidatePath(QUESTIONS_PATH)
}

export async function createPassageAction(
  data: PassageFormData
): Promise<ActionResult> {
  const parsed = passageFormSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, message: "Data passage tidak valid." }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: "Sesi berakhir. Silakan masuk kembali." }
  }

  const { error } = await supabase.from("passages").insert({
    title: parsed.data.title,
    content: parsed.data.content,
    created_by: user.id,
  })

  if (error) return { success: false, message: error.message }

  revalidate()
  return { success: true, message: "Passage berhasil ditambahkan." }
}

export async function updatePassageAction(
  id: string,
  data: PassageFormData
): Promise<ActionResult> {
  if (!id) return { success: false, message: "Passage tidak ditemukan." }

  const parsed = passageFormSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, message: "Data passage tidak valid." }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from("passages")
    .update({ title: parsed.data.title, content: parsed.data.content })
    .eq("id", id)

  if (error) return { success: false, message: error.message }

  revalidate()
  return { success: true, message: "Passage berhasil diperbarui." }
}

export async function deletePassageAction(id: string): Promise<ActionResult> {
  if (!id) return { success: false, message: "Passage tidak ditemukan." }

  const supabase = await createClient()
  const { error } = await supabase.from("passages").delete().eq("id", id)

  if (error) return { success: false, message: error.message }

  revalidate()
  return { success: true, message: "Passage berhasil dihapus." }
}
