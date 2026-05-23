-- ==============================================================
-- AURA OS V2 - ENTERPRISE SUPABASE SCHEMA & ROW LEVEL SECURITY
-- ==============================================================

-- 1. ENABLE EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USERS TABLE (Extends Auth)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  company_name TEXT,
  role VARCHAR(50) DEFAULT 'homeowner', -- homeowner, integrator, technician
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- 3. SPACES (Sites/Residências)
CREATE TABLE public.spaces (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  type VARCHAR(20) DEFAULT 'house',
  owner_id UUID REFERENCES public.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.spaces ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view spaces they own or manage" ON public.spaces
  FOR SELECT USING (
    owner_id = auth.uid() OR 
    id IN (SELECT space_id FROM public.space_members WHERE user_id = auth.uid())
  );
CREATE POLICY "Users can insert their own spaces" ON public.spaces FOR INSERT WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Users can update their own spaces" ON public.spaces FOR UPDATE USING (owner_id = auth.uid());
CREATE POLICY "Users can delete their own spaces" ON public.spaces FOR DELETE USING (owner_id = auth.uid());

-- 4. SPACE MEMBERS (Enterprise Technician Access)
CREATE TABLE public.space_members (
  space_id UUID REFERENCES public.spaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  access_level VARCHAR(20) DEFAULT 'technician',
  PRIMARY KEY (space_id, user_id)
);

ALTER TABLE public.space_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners can manage members" ON public.space_members 
  FOR ALL USING (
    space_id IN (SELECT id FROM public.spaces WHERE owner_id = auth.uid())
  );

-- 5. ZONES (Rooms/Divisions)
CREATE TABLE public.zones (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  space_id UUID REFERENCES public.spaces(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  points JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.zones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Access zones via space permissions" ON public.zones
  FOR ALL USING (
    space_id IN (SELECT id FROM public.spaces WHERE owner_id = auth.uid()) OR
    space_id IN (SELECT space_id FROM public.space_members WHERE user_id = auth.uid())
  );

-- 6. DEVICES (IoT Hardwares in 3D)
CREATE TABLE public.devices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  space_id UUID REFERENCES public.spaces(id) ON DELETE CASCADE NOT NULL,
  zone_id UUID REFERENCES public.zones(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  protocol VARCHAR(20) DEFAULT 'Unconfigured',
  position_x FLOAT NOT NULL DEFAULT 0,
  position_y FLOAT NOT NULL DEFAULT 0,
  position_z FLOAT NOT NULL DEFAULT 0,
  rotation_x FLOAT DEFAULT 0,
  rotation_y FLOAT DEFAULT 0,
  rotation_z FLOAT DEFAULT 0,
  scale_x FLOAT DEFAULT 1,
  scale_y FLOAT DEFAULT 1,
  scale_z FLOAT DEFAULT 1,
  is_on BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Access devices via space permissions" ON public.devices
  FOR ALL USING (
    space_id IN (SELECT id FROM public.spaces WHERE owner_id = auth.uid()) OR
    space_id IN (SELECT space_id FROM public.space_members WHERE user_id = auth.uid())
  );

-- 7. AUTOMATIONS (Kira Engine)
CREATE TABLE public.automations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  space_id UUID REFERENCES public.spaces(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  trigger_device_id UUID REFERENCES public.devices(id) ON DELETE CASCADE,
  trigger_condition TEXT NOT NULL,
  action_device_id UUID REFERENCES public.devices(id) ON DELETE CASCADE,
  action_command TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.automations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Access automations via space permissions" ON public.automations
  FOR ALL USING (
    space_id IN (SELECT id FROM public.spaces WHERE owner_id = auth.uid()) OR
    space_id IN (SELECT space_id FROM public.space_members WHERE user_id = auth.uid())
  );

-- Enable Realtime for all interactive tables
alter publication supabase_realtime add table public.spaces;
alter publication supabase_realtime add table public.zones;
alter publication supabase_realtime add table public.devices;
alter publication supabase_realtime add table public.automations;

