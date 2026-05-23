'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function submitOnboarding(formData: FormData) {
  const supabase = createClient()
  
  // 1. Pega a sessão segura do usuário recém-logado
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // 2. Extrai os dados do formulário
  const fullName = formData.get('fullName') as string
  const phone = formData.get('phone') as string
  const spaceName = formData.get('spaceName') as string
  const planType = formData.get('planType') as string

  // 3. Registra os dados completos do Usuário (Nome e Contato)
  const { error: userError } = await supabase
    .from('users')
    .upsert({ 
      id: user.id, 
      full_name: fullName,
      phone: phone // Nova coluna que vamos criar
    })

  if (userError) throw new Error(`Erro ao salvar perfil: ${userError.message}`)

  // 4. Cria o "Tenant" (O Espaço Físico do Cliente) e Inicia a contagem do Trial de 15 Dias
  // No PostgreSQL o valor de trial_ends_at será calculado com NOW() + 15 days via trigger ou inserção.
  // Como estamos no frontend/server action, enviamos a data calculada aqui em UTC.
  const trialEndDate = new Date();
  trialEndDate.setDate(trialEndDate.getDate() + 15);

  const { data: space, error: spaceError } = await supabase
    .from('spaces')
    .insert({
      name: spaceName,
      owner_id: user.id,
      plan_type: planType,
      trial_ends_at: trialEndDate.toISOString() // Nova coluna para controle de acesso
    })
    .select()
    .single()

  if (spaceError) throw new Error(`Erro ao criar espaço: ${spaceError.message}`)

  // 5. Conecta o Usuário ao Espaço como Administrador Supremo (RBAC)
  const { error: memberError } = await supabase
    .from('space_members')
    .insert({
      space_id: space.id,
      user_id: user.id,
      role: 'admin'
    })

  if (memberError) throw new Error(`Erro ao atribuir permissão: ${memberError.message}`)

  // 6. Tudo pronto, ejetamos ele para o Dashboard Operacional
  redirect('/dashboard')
}
