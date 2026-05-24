-- ==========================================
-- KIRA OS - CORE DATABASE SCHEMA (POSTGRESQL)
-- Arquitetura Multi-Tenant para Residências e Corporativo
-- ==========================================

-- 1. USERS (Estende o sistema de autenticação nativo)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  preferred_language VARCHAR(5) DEFAULT 'pt-BR',
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ORGANIZATIONS / SPACES (O "Tenant")
-- Um "Espaço" pode ser uma Casa (Home Plan) ou um Prédio Inteiro (Enterprise Plan)
CREATE TABLE public.spaces (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL, -- Ex: "Casa de Campo", "Escritório Spero"
  plan_type VARCHAR(20) DEFAULT 'home', -- 'home' ou 'enterprise'
  owner_id UUID REFERENCES public.users(id) NOT NULL,
  stripe_subscription_id TEXT, -- Ligação com o faturamento
  trial_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SPACE_MEMBERS (Controle de Acesso / RBAC)
CREATE TABLE public.space_members (
  space_id UUID REFERENCES public.spaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  role VARCHAR(20) DEFAULT 'member', -- 'admin', 'manager', 'member'
  PRIMARY KEY (space_id, user_id)
);

-- 4. ROOMS (Os Ambientes do Motor 3D)
CREATE TABLE public.rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  space_id UUID REFERENCES public.spaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- Ex: "Sala de Estar", "Sala de Reunião A"
  floor_level INTEGER DEFAULT 0, -- Térreo, 1º andar, etc
  -- O mapa 3D cru convertido em JSON (Coordenadas de paredes, pisos, materiais)
  geometry_data JSONB DEFAULT '{}', 
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. DEVICES (O Hardware IoT IoT Universal)
CREATE TABLE public.devices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- Ex: "Lâmpada Teto", "Ar Condicionado"
  brand VARCHAR(50), -- 'sonoff', 'tuya', 'philips', 'matter'
  device_type VARCHAR(50), -- 'light', 'thermostat', 'sensor', 'blind'
  -- Coordenadas X, Y, Z de onde o hardware está posicionado no mapa 3D
  position_x FLOAT DEFAULT 0,
  position_y FLOAT DEFAULT 0,
  position_z FLOAT DEFAULT 0,
  -- JSON que representa o estado atual (Ligado, Cor, Intensidade)
  state JSONB DEFAULT '{"power": "off"}',
  -- Token de API externo caso seja Cloud-to-Cloud
  provider_token TEXT,
  last_ping TIMESTAMPTZ DEFAULT NOW()
);

-- 6. AUTOMATIONS (O Cérebro)
CREATE TABLE public.automations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  space_id UUID REFERENCES public.spaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- Ex: "Modo Cinema"
  -- A Trigger que dispara (Ex: Voz, Tempo, Movimento)
  trigger_type VARCHAR(50), 
  trigger_condition JSONB,
  -- A Matriz de Comandos que nossa IA gerou
  actions JSONB NOT NULL, 
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- INDEXES PARA ALTA PERFORMANCE
-- ==========================================
CREATE INDEX idx_devices_room ON public.devices(room_id);
CREATE INDEX idx_rooms_space ON public.rooms(space_id);
CREATE INDEX idx_space_members_user ON public.space_members(user_id);

-- ==========================================
-- AURA ENTERPRISE (ROOT & TICKETING)
-- ==========================================

-- 1. Upgrade na tabela Users (Super Administradores do Root)
ALTER TABLE public.users ADD COLUMN is_superadmin BOOLEAN DEFAULT FALSE;

-- 2. Sistema de Tickets (Helpdesk)
CREATE TABLE public.tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'open', -- 'open', 'in_progress', 'resolved', 'closed'
  priority VARCHAR(20) DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Mensagens dentro do Ticket
CREATE TABLE public.ticket_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Quem enviou (Cliente ou Suporte)
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tickets_user ON public.tickets(user_id);
CREATE INDEX idx_ticket_messages_ticket ON public.ticket_messages(ticket_id);
