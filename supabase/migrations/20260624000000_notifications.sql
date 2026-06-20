-- ============================================================================
-- PTESOL — Notifications
-- Migration: 20260624000000_notifications
--
-- In-app notifications (PRD §7.11) + Realtime. Email delivery is handled in the
-- app via Resend; this table backs the in-app bell.
-- ============================================================================

CREATE TYPE public.notification_type AS ENUM (
  'session_invite',
  'result_ready',
  'ai_ready',
  'account_locked',
  'account_unlocked',
  'reminder',
  'system'
);

CREATE TABLE public.notifications (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title      varchar(255) NOT NULL,
  message    text        NOT NULL,
  type       public.notification_type NOT NULL,
  is_read    boolean     NOT NULL DEFAULT false,
  metadata   jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user ON public.notifications(user_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Read / mark-as-read only your own notifications.
CREATE POLICY "notifications_select_own"
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "notifications_update_own"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Insert: a user can create their own, and admins can create for any user
-- (e.g. account_unlocked notifications when an admin unlocks a student).
CREATE POLICY "notifications_insert_own"
  ON public.notifications FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "notifications_admin_insert"
  ON public.notifications FOR INSERT
  WITH CHECK (public.is_admin());

-- ---------------------------------------------------------------------------
-- Realtime: stream inserts to the owning user (RLS-filtered).
-- ---------------------------------------------------------------------------
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
