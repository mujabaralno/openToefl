-- ============================================================================
-- PTESOL — Test Sessions (Manajemen Sesi)
-- Migration: 20260626000000_sessions
--
-- Admin-created test events ("TOEFL Batch Prodi Informatika — Genap 2025").
-- Students join via a unique 6–8 char invite code. Results per session are
-- exported to Excel from the admin panel.
--
-- Tables: sessions, session_participants (PRD §7.4 / §7.5)
-- Also wires the previously-deferred test_attempts.session_id FK.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. sessions  (PRD §7.4)
-- ---------------------------------------------------------------------------
CREATE TABLE public.sessions (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title             varchar(255) NOT NULL,
  description       text,
  program_study     varchar(100),
  faculty           varchar(100),
  invite_code       varchar(10) NOT NULL UNIQUE,
  start_date        timestamptz NOT NULL,
  end_date          timestamptz NOT NULL,
  max_participants  int         CHECK (max_participants IS NULL OR max_participants > 0),
  is_active         boolean     NOT NULL DEFAULT true,
  created_by        uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.sessions IS 'Admin-created TOEFL test sessions. Students join via invite_code.';
COMMENT ON COLUMN public.sessions.invite_code IS 'Unique 6–8 char join code, generated app-side.';

CREATE INDEX idx_sessions_invite_code ON public.sessions(invite_code);
CREATE INDEX idx_sessions_created_by ON public.sessions(created_by);

CREATE TRIGGER sessions_updated_at
  BEFORE UPDATE ON public.sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- ---------------------------------------------------------------------------
-- 2. session_participants  (PRD §7.5)
-- ---------------------------------------------------------------------------
CREATE TABLE public.session_participants (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  uuid        NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  user_id     uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  joined_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (session_id, user_id)
);

COMMENT ON TABLE public.session_participants IS 'Join table: which students joined which session.';

CREATE INDEX idx_session_participants_session ON public.session_participants(session_id);
CREATE INDEX idx_session_participants_user ON public.session_participants(user_id);

-- ---------------------------------------------------------------------------
-- 3. Wire the deferred test_attempts.session_id FK
-- The column already exists (created in the MVP schema as a bare uuid). All
-- current values are NULL, so adding the constraint is safe.
-- ---------------------------------------------------------------------------
ALTER TABLE public.test_attempts
  ADD CONSTRAINT test_attempts_session_id_fkey
  FOREIGN KEY (session_id) REFERENCES public.sessions(id) ON DELETE SET NULL;

CREATE INDEX idx_test_attempts_session ON public.test_attempts(session_id)
  WHERE session_id IS NOT NULL;

-- ============================================================================
-- 4. ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.sessions             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_participants ENABLE ROW LEVEL SECURITY;

-- ----- sessions -----
-- Admin: full control.
CREATE POLICY "sessions_admin_select"
  ON public.sessions FOR SELECT
  USING (public.is_admin());

CREATE POLICY "sessions_admin_insert"
  ON public.sessions FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "sessions_admin_update"
  ON public.sessions FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "sessions_admin_delete"
  ON public.sessions FOR DELETE
  USING (public.is_admin());

-- Students: can read only the sessions they've joined (so the join lookup by
-- code is done server-side with the service-role client, never by enumerating).
CREATE POLICY "sessions_select_participant"
  ON public.sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.session_participants sp
      WHERE sp.session_id = sessions.id
        AND sp.user_id = auth.uid()
    )
  );

-- ----- session_participants -----
-- Students manage their own participation rows.
CREATE POLICY "session_participants_select_own"
  ON public.session_participants FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "session_participants_insert_own"
  ON public.session_participants FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "session_participants_delete_own"
  ON public.session_participants FOR DELETE
  USING (user_id = auth.uid());

-- Admin can read & remove any participant.
CREATE POLICY "session_participants_admin_select"
  ON public.session_participants FOR SELECT
  USING (public.is_admin());

CREATE POLICY "session_participants_admin_delete"
  ON public.session_participants FOR DELETE
  USING (public.is_admin());
