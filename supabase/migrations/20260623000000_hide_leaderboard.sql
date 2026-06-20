-- ============================================================================
-- PTESOL — Leaderboard privacy flag
-- Migration: 20260623000000_hide_leaderboard
--
-- Lets a student hide their name from the leaderboard (shown as "Anonim").
-- Lives on users for now; a full user_settings table arrives in Phase 7.
-- ============================================================================

ALTER TABLE public.users
  ADD COLUMN hide_leaderboard boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.users.hide_leaderboard IS 'When true, the user appears as "Anonim" on leaderboards.';
