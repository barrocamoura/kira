'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function submitOnboarding(formData: FormData) {
  const supabase = createClient()
  
  // 1. Extrai os dados do formulário
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string
  const phone = formData.get('phone') as string
  const spaceName = formData.get('spaceName') as string
  const planType = formData.get('planType') as string

  // Ao usar o Server Client, não enviamos a Origin do browser, mas vamos garantir
  // que o emailRedirectTo é explicitamente válido para evitar o erro do "Invalid path"
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: 'http://localhost:3000', // Override force
      data: {
        full_name: fullName
      }
    }
  })

  if (authError) return { error: `Erro no registo: ${authError.message}` }
  
  const user = authData.user
  if (!user) {
    return { error: 'Utilizador não foi criado corretamente.' }
  }



  // 3. Atualiza os dados de contacto do Usuário
  const { error: userError } = await supabase
    .from('users')
    .update({ 
      phone: phone
    })
    .eq('id', user.id)

  if (userError) return { error: `Erro ao salvar perfil: ${userError.message}` }

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

  if (spaceError) return { error: `Erro ao criar espaço: ${spaceError.message}` }

  // 5. Conecta o Usuário ao Espaço como Administrador Supremo (RBAC)
  const { error: memberError } = await supabase
    .from('space_members')
    .insert({
      space_id: space.id,
      user_id: user.id,
      role: 'admin'
    })

  if (memberError) return { error: `Erro ao atribuir permissão: ${memberError.message}` }

  // 6. Tudo pronto, retornamos sucesso
  return { success: true, error: null }
}
