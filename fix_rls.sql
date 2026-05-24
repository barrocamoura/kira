-- Fix RLS and missing kiosk rows
ALTER TABLE public.transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.kiosk_settings DISABLE ROW LEVEL SECURITY;

-- Garante que todos os users existentes têm configurações do kiosk
INSERT INTO public.kiosk_settings (user_id)
SELECT id FROM public.users
ON CONFLICT (user_id) DO NOTHING;
