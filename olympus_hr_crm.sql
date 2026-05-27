-- ==========================================
-- PROJECT OLYMPUS: HR & CRM EXPANSION
-- ==========================================

-- 1. EMPLOYEE RECORDS (CHRO Hub)
-- Manages internal staff, freelancers, outsourced roles
CREATE TABLE IF NOT EXISTS public.employee_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    employment_type VARCHAR(50) DEFAULT 'full-time', -- 'full-time', 'part-time', 'freelancer', 'outsourced'
    department VARCHAR(50) NOT NULL, -- 'Engineering', 'Support', 'Sales', 'Executive'
    base_salary DECIMAL(10, 2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'EUR',
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'on_leave', 'terminated'
    productivity_score INTEGER DEFAULT 100, -- 0 to 100 metric
    join_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- 2. OPERATING EXPENSES (CHRO / CFO Hub)
-- Manages all OPEX (Salaries, Servers, Marketing, Freelancers)
CREATE TABLE IF NOT EXISTS public.operating_expenses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category VARCHAR(50) NOT NULL, -- 'payroll', 'infrastructure', 'marketing', 'software', 'freelance'
    description TEXT,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    expense_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'paid', -- 'paid', 'pending'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. EMPLOYEE ABSENCES (CHRO Hub)
-- Leaves, Vacations, Sick Days
CREATE TABLE IF NOT EXISTS public.employee_absences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    absence_type VARCHAR(50) NOT NULL, -- 'vacation', 'sick', 'unpaid', 'parental'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CLIENT CONTRACTS (CRO Hub)
-- SaaS subscriptions and client lifecycle
CREATE TABLE IF NOT EXISTS public.client_contracts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    plan_name VARCHAR(50) NOT NULL, -- 'Home Basic', 'Enterprise Pro', 'Kiosk Standard'
    mrr_value DECIMAL(10, 2) DEFAULT 0.00,
    billing_cycle VARCHAR(20) DEFAULT 'monthly', -- 'monthly', 'yearly'
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'suspended', 'canceled', 'trial'
    start_date DATE DEFAULT CURRENT_DATE,
    next_billing_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- 5. DISABLE RLS FOR DEVELOPMENT
ALTER TABLE public.employee_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.operating_expenses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_absences DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_contracts DISABLE ROW LEVEL SECURITY;

-- 6. ENSURE "STATUS" EXISTS IN USERS (For suspending accounts completely)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'status') THEN
        ALTER TABLE public.users ADD COLUMN status VARCHAR(20) DEFAULT 'active';
    END IF;
END $$;
