-- ==========================================
-- SCRIPT DE UPGRADE: PHASE 3 (RBAC, TRANSAÇÕES, KIOSK)
-- ==========================================

-- 1. Desativar RLS definitivamente (Fase de Desenvolvimento)
ALTER TABLE public.tickets DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.spaces DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms DISABLE ROW LEVEL SECURITY;

-- 2. Atualizar tabela USERS com Role Based Access Control (RBAC)
-- Removendo is_superadmin antigo se existir
ALTER TABLE public.users DROP COLUMN IF EXISTS is_superadmin;
-- Adicionando a coluna de Role
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'client';
-- As Roles válidas serão: 'admin', 'support', 'influencer', 'client'

-- 3. Criar a Tabela de Transações Financeiras
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'paid', -- 'paid', 'pending', 'failed'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Criar Tabela de Configurações do Kiosk
CREATE TABLE IF NOT EXISTS public.kiosk_settings (
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE PRIMARY KEY,
    widgets JSONB DEFAULT '{"news": true, "weather": true, "energy": true, "solar": false}',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Função e Trigger para Sincronizar Auth -> Public Users
-- Isto resolve o bug do root não mostrar os utilizadores
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, full_name, avatar_url, role)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    COALESCE(new.raw_user_meta_data->>'avatar_url', ''),
    'client'
  )
  ON CONFLICT (id) DO NOTHING;
  
  -- Já criar as configurações padrão do Kiosk
  INSERT INTO public.kiosk_settings (user_id) VALUES (new.id) ON CONFLICT DO NOTHING;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apaga o trigger se já existir para recriar limpo
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Sincronizar os utilizadores que já existem na auth.users mas faltam na public
INSERT INTO public.users (id, full_name, role)
SELECT id, COALESCE(raw_user_meta_data->>'full_name', email), 'admin'
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- Como o CTO (você) é o primeiro, garantimos que é Admin:
UPDATE public.users SET role = 'admin' WHERE id IN (SELECT id FROM auth.users LIMIT 1);
