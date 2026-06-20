/**
 * types/listening.ts
 * Listening Part B/C group types. Audio is per-question (questions.audio_url);
 * a group only bundles + orders the questions of one conversation/talk.
 */

import type { Tables } from "@/types/database.types"

export type ListeningGroupRow = Tables<"listening_groups">
