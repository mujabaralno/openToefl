-- ============================================================================
-- PTESOL — Practice Mode (Post-MVP)
-- Migration: 20260621000000_practice
--
-- practice_attempts + practice_answers (PRD §7.8 / §7.9). Practice is relaxed:
-- no anti-cheat, score in percentage. RLS mirrors the test_* tables.
-- ============================================================================

CREATE TYPE public.practice_status AS ENUM ('in_progress', 'completed');

-- ---------------------------------------------------------------------------
-- practice_attempts
-- ---------------------------------------------------------------------------
CREATE TABLE public.practice_attempts (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  section          public.question_section NOT NULL,
  status           public.practice_status  NOT NULL DEFAULT 'in_progress',
  total_questions  int         NOT NULL,
  correct_count    int,
  score_percentage numeric(5, 2),
  started_at       timestamptz NOT NULL DEFAULT now(),
  completed_at     timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.practice_attempts IS 'A practice session per section. Score is a percentage (not the 310–677 scale).';

CREATE INDEX idx_practice_attempts_user ON public.practice_attempts(user_id);

-- ---------------------------------------------------------------------------
-- practice_answers
-- ---------------------------------------------------------------------------
CREATE TABLE public.practice_answers (
  id                  uuid     PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_attempt_id uuid     NOT NULL REFERENCES public.practice_attempts(id) ON DELETE CASCADE,
  question_id         uuid     NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  selected_answer     char(1)  CHECK (selected_answer IS NULL OR selected_answer IN ('A', 'B', 'C', 'D')),
  is_correct          boolean,
  answered_at         timestamptz,
  UNIQUE (practice_attempt_id, question_id)
);

CREATE INDEX idx_practice_answers_attempt ON public.practice_answers(practice_attempt_id);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
ALTER TABLE public.practice_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_answers  ENABLE ROW LEVEL SECURITY;

-- practice_attempts: students manage their own; admins can read all.
CREATE POLICY "practice_attempts_select_own"
  ON public.practice_attempts FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "practice_attempts_insert_own"
  ON public.practice_attempts FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "practice_attempts_update_own"
  ON public.practice_attempts FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "practice_attempts_admin_select"
  ON public.practice_attempts FOR SELECT
  USING (public.is_admin());

-- practice_answers: scoped to the owning attempt; admins can read all.
CREATE POLICY "practice_answers_select_own"
  ON public.practice_answers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.practice_attempts
      WHERE practice_attempts.id = practice_answers.practice_attempt_id
        AND practice_attempts.user_id = auth.uid()
    )
  );

CREATE POLICY "practice_answers_insert_own"
  ON public.practice_answers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.practice_attempts
      WHERE practice_attempts.id = practice_answers.practice_attempt_id
        AND practice_attempts.user_id = auth.uid()
    )
  );

CREATE POLICY "practice_answers_update_own"
  ON public.practice_answers FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.practice_attempts
      WHERE practice_attempts.id = practice_answers.practice_attempt_id
        AND practice_attempts.user_id = auth.uid()
    )
  );

CREATE POLICY "practice_answers_admin_select"
  ON public.practice_answers FOR SELECT
  USING (public.is_admin());
