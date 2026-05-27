-- Inserir administradores na tabela employee_records
INSERT INTO public.employee_records (user_id, employment_type, department, base_salary, currency, status, productivity_score)
SELECT id, 'full-time', 'Executive', 5000.00, 'EUR', 'active', 98
FROM public.users
WHERE role IN ('admin', 'ceo', 'cfo', 'cto', 'coo', 'chro', 'cro')
ON CONFLICT (user_id) DO NOTHING;

-- Inserir todos os utilizadores na tabela client_contracts (para simular que todos assinaram um plano SaaS)
INSERT INTO public.client_contracts (user_id, plan_name, mrr_value, billing_cycle, status)
SELECT id, 'Enterprise Pro', 199.00, 'monthly', 'active'
FROM public.users
ON CONFLICT (user_id) DO NOTHING;
