import { z } from "zod"

// ---------------------------------------------------------------------------
// Maintenance mode form/action schema.
// ---------------------------------------------------------------------------
export const maintenanceSchema = z.object({
  enabled: z.boolean(),
  message: z
    .string()
    .trim()
    .max(500, "Pesan maksimal 500 karakter")
    .optional(),
})

export type MaintenanceFormData = z.infer<typeof maintenanceSchema>
