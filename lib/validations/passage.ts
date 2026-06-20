import { z } from "zod"

export const passageFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Judul wajib diisi")
    .max(255, "Judul terlalu panjang"),
  content: z
    .string()
    .trim()
    .min(1, "Isi passage wajib diisi")
    .max(20000, "Isi passage terlalu panjang"),
})
