/**
 * types/notification.ts
 */

import type { Enums, Tables } from "@/types/database.types"

export type NotificationRow = Tables<"notifications">
export type NotificationType = Enums<"notification_type">
