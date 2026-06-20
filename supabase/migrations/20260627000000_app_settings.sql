-- ============================================================================
-- PTESOL — Global App Settings + Maintenance Mode
-- Migration: 20260627000000_app_settings
--
-- A SINGLETON table (exactly one row) holding global application settings.
-- Currently: maintenance mode toggle + optional custom message. Read by the
-- middleware on every request (cached) to gate non-admin traffic.
--
-- RLS: SELECT for everyone (middleware reads it with the anon key, often
-- without a session); UPDATE only for admins.
-- ============================================================================

CREATE TABLE public.app_settings (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  maintenance_mode    boolean     NOT NULL DEFAULT false,
  maintenance_message text,
  updated_by          uuid        REFERENCES public.users(id) ON DELETE SET NULL,
  updated_at          timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.app_settings IS 'Singleton row of global app settings. Read by middleware (maintenance gate).';
COMMENT ON COLUMN public.app_settings.maintenance_mode IS 'When true, non-admin traffic is redirected to /maintenance.';
COMMENT ON COLUMN public.app_settings.maintenance_message IS 'Optional message shown on the /maintenance page.';

-- Enforce a single row: a unique index on a constant expression allows only one.
CREATE UNIQUE INDEX app_settings_singleton ON public.app_settings ((true));

CREATE TRIGGER app_settings_updated_at
  BEFORE UPDATE ON public.app_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Seed the single settings row (maintenance off by default).
INSERT INTO public.app_settings (maintenance_mode) VALUES (false);

-- ============================================================================
-- Row Level Security
-- ============================================================================
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Everyone (incl. anon — the middleware reads with the anon key) can read.
CREATE POLICY "app_settings_select_all"
  ON public.app_settings FOR SELECT
  USING (true);

-- Only admins can change settings.
CREATE POLICY "app_settings_admin_update"
  ON public.app_settings FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
