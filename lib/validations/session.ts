import { z } from "zod"

// ---------------------------------------------------------------------------
// Session form schema (admin create/edit)
//
// Dates come from <input type="datetime-local"> as "YYYY-MM-DDTHH:mm" strings.
// We keep them as strings in the form and convert to ISO in the server action,
// so the schema validates the local-datetime shape and the start < end rule.
// Types are derived from this schema in types/session.ts (no duplication).
// ---------------------------------------------------------------------------

const LOCAL_DATETIME_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/

const localDateTime = z
  .string()
  .trim()
  .min(1, "Tanggal wajib diisi")
  .regex(LOCAL_DATETIME_RE, "Format tanggal tidak valid")

export const sessionFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Judul sesi wajib diisi")
      .max(255, "Judul terlalu panjang"),
    description: z
      .string()
      .trim()
      .max(2000, "Deskripsi terlalu panjang")
      .optional(),
    program_study: z
      .string()
      .trim()
      .max(100, "Nama prodi terlalu panjang")
      .optional(),
    faculty: z
      .string()
      .trim()
      .max(100, "Nama fakultas terlalu panjang")
      .optional(),
    start_date: localDateTime,
    end_date: localDateTime,
    // Kept as a string in the form ("" = no limit); parsed to a number in the
    // server action. A plain string avoids z.coerce vs. RHF resolver friction.
    max_participants: z
      .string()
      .trim()
      .regex(/^\d*$/, "Harus berupa angka")
      .refine((value) => value === "" || Number(value) >= 1, "Minimal 1 peserta")
      .refine(
        (value) => value === "" || Number(value) <= 100000,
        "Jumlah terlalu besar"
      )
      .optional(),
    is_active: z.boolean(),
  })
  .superRefine((data, ctx) => {
    const start = new Date(data.start_date).getTime()
    const end = new Date(data.end_date).getTime()
    if (Number.isFinite(start) && Number.isFinite(end) && end <= start) {
      ctx.addIssue({
        code: "custom",
        path: ["end_date"],
        message: "Tanggal selesai harus setelah tanggal mulai",
      })
    }
  })

// ---------------------------------------------------------------------------
// Join-by-code schema (student)
// ---------------------------------------------------------------------------
export const joinSessionSchema = z.object({
  invite_code: z
    .string()
    .trim()
    .min(6, "Kode minimal 6 karakter")
    .max(10, "Kode maksimal 10 karakter")
    .regex(/^[A-Za-z0-9]+$/, "Kode hanya boleh huruf dan angka")
    .transform((value) => value.toUpperCase()),
})
