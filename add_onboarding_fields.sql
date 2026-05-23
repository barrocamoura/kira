-- Adiciona o telefone de contato no perfil do usuário
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone VARCHAR(50);

-- Adiciona a data de término do período de teste no Espaço (SaaS)
ALTER TABLE public.spaces ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ;
