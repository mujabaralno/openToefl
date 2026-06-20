-- ============================================================================
-- PTESOL — MVP Database Schema
-- Migration: 20260619000000_create_mvp_schema
--
-- Tables: users, passages, questions, test_attempts, test_answers
-- Includes: enums, RLS policies, helper functions, trigger for auth signup
-- ============================================================================

-- ============================================================================
-- 1. ENUM TYPES
-- ============================================================================

CREATE TYPE public.user_role AS ENUM ('admin', 'student');
CREATE TYPE public.question_section AS ENUM ('listening', 'structure', 'reading');
CREATE TYPE public.difficulty_level AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE public.test_status AS ENUM ('in_progress', 'completed', 'violated');

-- ============================================================================
-- 2. HELPER FUNCTIONS (table-independent)
-- ============================================================================

-- Auto-update `updated_at` column on row modification.
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ============================================================================
-- 3. TABLES
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 3.1 users
-- Linked to auth.users via trigger (handle_new_user). id = auth.users.id.
-- ---------------------------------------------------------------------------
CREATE TABLE public.users (
  id            uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         varchar(255) NOT NULL UNIQUE,
  full_name     varchar(255) NOT NULL DEFAULT '',
  student_id    varchar(50),
  role          public.user_role NOT NULL DEFAULT 'student',
  program_study varchar(100),
  faculty       varchar(100),
  avatar_url    text,
  is_locked     boolean     NOT NULL DEFAULT false,
  locked_until  timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.users IS 'Public profile for each registered user. Auto-created on auth signup.';
COMMENT ON COLUMN public.users.is_locked IS 'True when account is locked due to anti-cheat violation.';
COMMENT ON COLUMN public.users.locked_until IS 'Timestamp when auto-unlock should happen (24h after violation).';

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- ---------------------------------------------------------------------------
-- 3.2 passages
-- Reading comprehension passages. Referenced by questions.passage_id.
-- ---------------------------------------------------------------------------
CREATE TABLE public.passages (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title       varchar(255) NOT NULL,
  content     text        NOT NULL,
  created_by  uuid        NOT NULL REFERENCES public.users(id) ON DELETE SET NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.passages IS 'Reading comprehension passages for the reading section.';

CREATE TRIGGER passages_updated_at
  BEFORE UPDATE ON public.passages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- ---------------------------------------------------------------------------
-- 3.3 questions
-- All question types: listening, structure, reading.
-- ---------------------------------------------------------------------------
CREATE TABLE public.questions (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  section         public.question_section NOT NULL,
  question_text   text,
  audio_url       text,
  passage_id      uuid        REFERENCES public.passages(id) ON DELETE SET NULL,
  options         jsonb       NOT NULL DEFAULT '{}',
  correct_answer  char(1)     NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
  explanation     text,
  difficulty      public.difficulty_level,
  tags            text[],
  is_active       boolean     NOT NULL DEFAULT true,
  created_by      uuid        NOT NULL REFERENCES public.users(id) ON DELETE SET NULL,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.questions IS 'Question bank for all three TOEFL ITP sections.';
COMMENT ON COLUMN public.questions.options IS 'JSONB: {"A":"...","B":"...","C":"...","D":"..."}';
COMMENT ON COLUMN public.questions.audio_url IS 'Supabase Storage signed URL (listening section only).';

CREATE INDEX idx_questions_section ON public.questions(section);
CREATE INDEX idx_questions_active ON public.questions(is_active) WHERE is_active = true;
CREATE INDEX idx_questions_passage ON public.questions(passage_id) WHERE passage_id IS NOT NULL;

CREATE TRIGGER questions_updated_at
  BEFORE UPDATE ON public.questions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- ---------------------------------------------------------------------------
-- 3.4 test_attempts
-- Each full TOEFL ITP simulation attempt by a student.
-- session_id is nullable — will reference sessions table in Post-MVP.
-- ---------------------------------------------------------------------------
CREATE TABLE public.test_attempts (
  id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  session_id            uuid,       -- FK to sessions table (Post-MVP)
  status                public.test_status NOT NULL DEFAULT 'in_progress',
  current_section       public.question_section,
  listening_started_at  timestamptz,
  structure_started_at  timestamptz,
  reading_started_at    timestamptz,
  listening_raw         int         CHECK (listening_raw BETWEEN 0 AND 50),
  structure_raw         int         CHECK (structure_raw BETWEEN 0 AND 40),
  reading_raw           int         CHECK (reading_raw BETWEEN 0 AND 50),
  listening_converted   int         CHECK (listening_converted BETWEEN 0 AND 68),
  structure_converted   int         CHECK (structure_converted BETWEEN 0 AND 68),
  reading_converted     int         CHECK (reading_converted BETWEEN 0 AND 67),
  total_score           int         CHECK (total_score BETWEEN 0 AND 677),
  violation_type        varchar(50),
  started_at            timestamptz NOT NULL DEFAULT now(),
  completed_at          timestamptz,
  created_at            timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.test_attempts IS 'Records each full simulation attempt. session_id FK deferred to Post-MVP.';
COMMENT ON COLUMN public.test_attempts.violation_type IS 'escape_key | shortcut_key | fullscreen_exit — set when status = violated.';

CREATE INDEX idx_test_attempts_user ON public.test_attempts(user_id);
CREATE INDEX idx_test_attempts_status ON public.test_attempts(status);

-- ---------------------------------------------------------------------------
-- 3.5 test_answers
-- Individual answers per question within a test attempt.
-- ---------------------------------------------------------------------------
CREATE TABLE public.test_answers (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id      uuid        NOT NULL REFERENCES public.test_attempts(id) ON DELETE CASCADE,
  question_id     uuid        NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  selected_answer char(1)     CHECK (selected_answer IS NULL OR selected_answer IN ('A', 'B', 'C', 'D')),
  is_correct      boolean,
  answered_at     timestamptz,
  UNIQUE (attempt_id, question_id)
);

COMMENT ON TABLE public.test_answers IS 'Per-question answer for a test attempt. Auto-saved during simulation.';

CREATE INDEX idx_test_answers_attempt ON public.test_answers(attempt_id);

-- ============================================================================
-- 4. HELPER FUNCTIONS (table-dependent — must come after CREATE TABLE)
-- ============================================================================

-- Check if the currently authenticated user has the 'admin' role.
-- SECURITY DEFINER so it can read public.users even when RLS is active.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- ============================================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.users         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.passages      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_answers  ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- 4.1 users policies
-- ---------------------------------------------------------------------------

-- Students can read their own profile
CREATE POLICY "users_select_own"
  ON public.users FOR SELECT
  USING (id = auth.uid());

-- Students can update their own profile (limited to non-sensitive fields)
CREATE POLICY "users_update_own"
  ON public.users FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Admin can read all users
CREATE POLICY "users_admin_select"
  ON public.users FOR SELECT
  USING (public.is_admin());

-- Admin can update all users (lock/unlock, role change, etc.)
CREATE POLICY "users_admin_update"
  ON public.users FOR UPDATE
  USING (public.is_admin());

-- ---------------------------------------------------------------------------
-- 4.2 passages policies
-- ---------------------------------------------------------------------------

-- All authenticated users can read passages (needed during tests)
CREATE POLICY "passages_select_authenticated"
  ON public.passages FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Admin can insert passages
CREATE POLICY "passages_admin_insert"
  ON public.passages FOR INSERT
  WITH CHECK (public.is_admin());

-- Admin can update passages
CREATE POLICY "passages_admin_update"
  ON public.passages FOR UPDATE
  USING (public.is_admin());

-- Admin can delete passages
CREATE POLICY "passages_admin_delete"
  ON public.passages FOR DELETE
  USING (public.is_admin());

-- ---------------------------------------------------------------------------
-- 4.3 questions policies
-- ---------------------------------------------------------------------------

-- All authenticated users can read active questions (needed during tests)
CREATE POLICY "questions_select_authenticated"
  ON public.questions FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Admin can insert questions
CREATE POLICY "questions_admin_insert"
  ON public.questions FOR INSERT
  WITH CHECK (public.is_admin());

-- Admin can update questions
CREATE POLICY "questions_admin_update"
  ON public.questions FOR UPDATE
  USING (public.is_admin());

-- Admin can delete questions
CREATE POLICY "questions_admin_delete"
  ON public.questions FOR DELETE
  USING (public.is_admin());

-- ---------------------------------------------------------------------------
-- 4.4 test_attempts policies
-- ---------------------------------------------------------------------------

-- Students can read their own attempts
CREATE POLICY "test_attempts_select_own"
  ON public.test_attempts FOR SELECT
  USING (user_id = auth.uid());

-- Students can insert their own attempts (start a new test)
CREATE POLICY "test_attempts_insert_own"
  ON public.test_attempts FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Students can update their own attempts (submit answers, complete test)
CREATE POLICY "test_attempts_update_own"
  ON public.test_attempts FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Admin can read all attempts
CREATE POLICY "test_attempts_admin_select"
  ON public.test_attempts FOR SELECT
  USING (public.is_admin());

-- Admin can update all attempts (e.g., mark violated)
CREATE POLICY "test_attempts_admin_update"
  ON public.test_attempts FOR UPDATE
  USING (public.is_admin());

-- ---------------------------------------------------------------------------
-- 4.5 test_answers policies
-- ---------------------------------------------------------------------------

-- Students can read their own answers (via attempt ownership)
CREATE POLICY "test_answers_select_own"
  ON public.test_answers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.test_attempts
      WHERE test_attempts.id = test_answers.attempt_id
        AND test_attempts.user_id = auth.uid()
    )
  );

-- Students can insert answers for their own attempt
CREATE POLICY "test_answers_insert_own"
  ON public.test_answers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.test_attempts
      WHERE test_attempts.id = test_answers.attempt_id
        AND test_attempts.user_id = auth.uid()
    )
  );

-- Students can update their own answers (change selection during test)
CREATE POLICY "test_answers_update_own"
  ON public.test_answers FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.test_attempts
      WHERE test_attempts.id = test_answers.attempt_id
        AND test_attempts.user_id = auth.uid()
    )
  );

-- Admin can read all answers
CREATE POLICY "test_answers_admin_select"
  ON public.test_answers FOR SELECT
  USING (public.is_admin());

-- ============================================================================
-- 6. AUTH TRIGGER — handle_new_user
-- ============================================================================

-- Automatically insert a public.users row when a new user signs up.
-- Signup metadata (full_name, student_id, program_study) is passed
-- via `options.data` in supabase.auth.signUp().
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, student_id, program_study)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    NEW.raw_user_meta_data ->> 'student_id',
    NEW.raw_user_meta_data ->> 'program_study'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 7. STORAGE BUCKET (for listening audio files)
-- ============================================================================

-- Create a storage bucket for audio files (MP3 for listening section).
-- Signed URLs will be generated server-side; the bucket itself is not public.
INSERT INTO storage.buckets (id, name, public)
VALUES ('audio', 'audio', false)
ON CONFLICT (id) DO NOTHING;

-- Allow admin to upload audio files
CREATE POLICY "audio_admin_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'audio'
    AND public.is_admin()
  );

-- Allow admin to update audio files
CREATE POLICY "audio_admin_update"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'audio'
    AND public.is_admin()
  );

-- Allow admin to delete audio files
CREATE POLICY "audio_admin_delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'audio'
    AND public.is_admin()
  );

-- Allow authenticated users to read audio files (for signed URL verification)
CREATE POLICY "audio_select_authenticated"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'audio'
    AND auth.uid() IS NOT NULL
  );
