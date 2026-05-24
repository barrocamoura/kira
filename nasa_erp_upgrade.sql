-- ==========================================
-- PROJECT OLYMPUS: NASA-LEVEL ERP UPGRADE
-- ==========================================

-- 1. DESATIVAR RLS PARA TODAS AS TABELAS ENVOLVIDAS
ALTER TABLE public.tickets DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.spaces DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.kiosk_settings DISABLE ROW LEVEL SECURITY;

-- 2. CORREÇÃO DA TABELA TICKET_MESSAGES
-- O seu schema antigo apontava para auth.users com a coluna sender_id. 
-- Vamos alinhar isto à força bruta com o novo schema.

DO $$
BEGIN
    -- Se a coluna sender_id existir, mudamos o nome para user_id
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ticket_messages' AND column_name = 'sender_id') THEN
        ALTER TABLE public.ticket_messages RENAME COLUMN sender_id TO user_id;
    END IF;
END $$;

-- Remover constrangimentos antigos de Foreign Keys na ticket_messages para evitar conflitos
DO $$
DECLARE r RECORD;
BEGIN
    FOR r IN (
        SELECT constraint_name 
        FROM information_schema.table_constraints 
        WHERE table_name = 'ticket_messages' AND constraint_type = 'FOREIGN KEY'
    ) LOOP
        EXECUTE 'ALTER TABLE public.ticket_messages DROP CONSTRAINT IF EXISTS ' || quote_ident(r.constraint_name) || ' CASCADE';
    END LOOP;
END $$;

-- Adicionar as chaves corretas do zero
ALTER TABLE public.ticket_messages
ADD CONSTRAINT ticket_messages_ticket_id_fkey FOREIGN KEY (ticket_id) REFERENCES public.tickets(id) ON DELETE CASCADE;

ALTER TABLE public.ticket_messages
ADD CONSTRAINT ticket_messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;

-- 3. REPARAÇÃO DA TABELA TICKETS
-- Remover constrangimentos antigos de Foreign Keys na tickets para evitar conflitos
DO $$
DECLARE r RECORD;
BEGIN
    FOR r IN (
        SELECT constraint_name 
        FROM information_schema.table_constraints 
        WHERE table_name = 'tickets' AND constraint_type = 'FOREIGN KEY'
    ) LOOP
        EXECUTE 'ALTER TABLE public.tickets DROP CONSTRAINT IF EXISTS ' || quote_ident(r.constraint_name) || ' CASCADE';
    END LOOP;
END $$;

-- Adicionar as chaves corretas do zero
ALTER TABLE public.tickets
ADD CONSTRAINT tickets_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- 4. GARANTIR KIOSK SETTINGS PARA TODOS
INSERT INTO public.kiosk_settings (user_id)
SELECT id FROM public.users
ON CONFLICT (user_id) DO NOTHING;

-- 5. ATUALIZAR TRIGGER DE AUTENTICAÇÃO
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Sincronizar qualquer utilizador que tenha escapado
INSERT INTO public.users (id, full_name, role)
SELECT id, COALESCE(raw_user_meta_data->>'full_name', email), 'admin'
FROM auth.users
ON CONFLICT (id) DO NOTHING;
