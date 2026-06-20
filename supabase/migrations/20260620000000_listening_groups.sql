-- ============================================================================
-- PTESOL — Listening Groups (Part B & C shared audio)
-- Migration: 20260620000000_listening_groups
--
-- Bundles Listening Part B & C questions that belong to the SAME conversation/
-- talk, so they stay together and in order when questions are shuffled.
-- Audio stays PER-QUESTION (questions.audio_url): in TOEFL ITP the first
-- question's audio contains the whole conversation + its question, and each
-- following question's audio is just that question being read.
--
-- Additive only — existing questions are untouched:
--   - listening question WITHOUT group_id  → Part A
--   - listening question WITH    group_id  → Part B/C (member of a conversation)
-- ============================================================================

-- 1. Enum for the listening part
CREATE TYPE public.listening_part AS ENUM ('A', 'B', 'C');

-- 2. listening_groups table (bundle + ordering unit, no audio of its own)
CREATE TABLE public.listening_groups (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  part        public.listening_part NOT NULL,
  title       varchar(255),
  transcript  text,
  created_by  uuid        NOT NULL REFERENCES public.users(id) ON DELETE SET NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.listening_groups IS 'Bundles Part B/C questions of one conversation/talk. Audio is per-question.';

CREATE TRIGGER listening_groups_updated_at
  BEFORE UPDATE ON public.listening_groups
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- 3. Link questions to a listening group (nullable = Part A / non-listening)
ALTER TABLE public.questions
  ADD COLUMN group_id      uuid REFERENCES public.listening_groups(id) ON DELETE SET NULL,
  ADD COLUMN order_in_group int;

COMMENT ON COLUMN public.questions.group_id IS 'Listening Part B/C group. NULL = Part A or non-listening.';
COMMENT ON COLUMN public.questions.order_in_group IS 'Order of this question within its listening group (1-based).';

CREATE INDEX idx_questions_group ON public.questions(group_id) WHERE group_id IS NOT NULL;

-- 4. Row Level Security (mirror passages/questions: admin write, auth read)
ALTER TABLE public.listening_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "listening_groups_select_authenticated"
  ON public.listening_groups FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "listening_groups_admin_insert"
  ON public.listening_groups FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "listening_groups_admin_update"
  ON public.listening_groups FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "listening_groups_admin_delete"
  ON public.listening_groups FOR DELETE
  USING (public.is_admin());
