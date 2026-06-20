-- ============================================================================
-- PTESOL — User Settings + Avatars
-- Migration: 20260625000000_user_settings
--
-- user_settings (PRD §7.12) for theme/language/notification prefs.
-- NOTE: hide_leaderboard lives on public.users (added earlier) — the
-- leaderboard reads it there, so it's not duplicated here.
-- Also creates a public "avatars" storage bucket for profile photos.
-- ============================================================================

CREATE TYPE public.theme_preference AS ENUM ('light', 'dark', 'system');
CREATE TYPE public.language_preference AS ENUM ('id', 'en');

CREATE TABLE public.user_settings (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid        NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  theme               public.theme_preference    NOT NULL DEFAULT 'system',
  language            public.language_preference NOT NULL DEFAULT 'id',
  email_notifications boolean     NOT NULL DEFAULT true,
  inapp_notifications boolean     NOT NULL DEFAULT true,
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER user_settings_updated_at
  BEFORE UPDATE ON public.user_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_settings_select_own"
  ON public.user_settings FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "user_settings_insert_own"
  ON public.user_settings FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "user_settings_update_own"
  ON public.user_settings FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Avatars storage bucket (public read; users write to their own folder)
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "avatars_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "avatars_insert_own"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "avatars_update_own"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "avatars_delete_own"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
