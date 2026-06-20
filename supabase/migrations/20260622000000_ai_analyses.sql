-- ============================================================================
-- PTESOL — AI Analysis (Post-MVP)
-- Migration: 20260622000000_ai_analyses
--
-- Stores AI-generated performance analysis per attempt (PRD §7.10).
-- ============================================================================

CREATE TYPE public.analysis_type AS ENUM ('simulation', 'practice');

CREATE TABLE public.ai_analyses (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  attempt_id          uuid        REFERENCES public.test_attempts(id) ON DELETE CASCADE,
  practice_attempt_id uuid        REFERENCES public.practice_attempts(id) ON DELETE CASCADE,
  analysis_type       public.analysis_type NOT NULL,
  weakness_areas      jsonb,
  strengths           jsonb,
  recommendations     jsonb,
  full_analysis       text        NOT NULL,
  model_used          varchar(100) NOT NULL,
  created_at          timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.ai_analyses IS 'AI-generated performance analysis for a test or practice attempt.';

CREATE INDEX idx_ai_analyses_attempt ON public.ai_analyses(attempt_id) WHERE attempt_id IS NOT NULL;
CREATE INDEX idx_ai_analyses_practice ON public.ai_analyses(practice_attempt_id) WHERE practice_attempt_id IS NOT NULL;
CREATE INDEX idx_ai_analyses_user ON public.ai_analyses(user_id);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
ALTER TABLE public.ai_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ai_analyses_select_own"
  ON public.ai_analyses FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "ai_analyses_insert_own"
  ON public.ai_analyses FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "ai_analyses_delete_own"
  ON public.ai_analyses FOR DELETE
  USING (user_id = auth.uid());

CREATE POLICY "ai_analyses_admin_select"
  ON public.ai_analyses FOR SELECT
  USING (public.is_admin());
