import { createClient } from "@/lib/supabase/server"
import type { Json } from "@/types/database.types"
import type { NotificationType } from "@/types/notification"

interface CreateNotificationInput {
  userId: string
  type: NotificationType
  title: string
  message: string
  metadata?: Json
}

/**
 * Insert an in-app notification. Best-effort: failures never break the caller.
 * Runs with the acting user's session (RLS: own, or admin-for-others).
 */
export async function createNotification(
  input: CreateNotificationInput
): Promise<void> {
  try {
    const supabase = await createClient()
    await supabase.from("notifications").insert({
      user_id: input.userId,
      type: input.type,
      title: input.title,
      message: input.message,
      metadata: input.metadata ?? null,
    })
  } catch {
    // Notifications are non-critical; ignore failures.
  }
}
