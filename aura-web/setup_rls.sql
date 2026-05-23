-- ==========================================
-- KIRA OS - POLÍTICAS DE SEGURANÇA (RLS)
-- ==========================================

-- 1. Habilitar RLS nas tabelas principais
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.space_members ENABLE ROW LEVEL SECURITY;

-- 2. Políticas para a Tabela USERS
-- Permite que o usuário insira e atualize APENAS o próprio perfil
CREATE POLICY "Permitir Inserção do Próprio Perfil" ON public.users
FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Permitir Leitura do Próprio Perfil" ON public.users
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Permitir Atualização do Próprio Perfil" ON public.users
FOR UPDATE USING (auth.uid() = id);

-- 3. Políticas para a Tabela SPACES (O Inquilino)
-- Permite que o usuário crie um espaço sendo o dono
CREATE POLICY "Permitir Criação de Espaços" ON public.spaces
FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Permite que o usuário veja seus próprios espaços
CREATE POLICY "Permitir Leitura dos Próprios Espaços" ON public.spaces
FOR SELECT USING (auth.uid() = owner_id);

-- 4. Políticas para SPACE_MEMBERS
-- Permite que o dono do espaço se adicione como membro
CREATE POLICY "Permitir Auto-Atribuição de Membro" ON public.space_members
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Permitir Leitura de Membros" ON public.space_members
FOR SELECT USING (auth.uid() = user_id);
