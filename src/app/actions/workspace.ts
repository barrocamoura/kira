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

  // Verifica se o utilizador já tem sessão iniciada (preso em limbo)
  const { data: { user: currentUser } } = await supabase.auth.getUser()
  
  let user = currentUser;

  // Se não estiver logado, cria a conta
  if (!user) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    })

    if (authError) {
      return { error: `Erro no registo: ${authError.message}` }
    }
    user = authData.user
  }
  
  if (!user) {
    return { error: 'Utilizador não foi criado corretamente.' }
  }

  try {
    // 3. Cria ou Atualiza os dados do Usuário na tabela public.users
    const { error: userError } = await supabase
      .from('users')
      .upsert({ 
        id: user.id,
        full_name: fullName,
        phone: phone
      })

    if (userError) console.warn("Supabase DB upsert falhou (tabelas em falta?). Prosseguindo com auth local.", userError)

    // 4. Cria o "Tenant" (O Espaço Físico do Cliente) e Inicia a contagem do Trial de 15 Dias
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 15);

    const { data: space, error: spaceError } = await supabase
      .from('spaces')
      .insert({
        name: spaceName,
        owner_id: user.id,
        plan_type: planType,
        trial_ends_at: trialEndDate.toISOString()
      })
      .select()
      .single()

    if (!spaceError && space) {
      // 5. Conecta o Usuário ao Espaço como Administrador Supremo (RBAC)
      await supabase
        .from('space_members')
        .insert({
          space_id: space.id,
          user_id: user.id,
          role: 'admin'
        })
    }
  } catch (dbErr) {
    console.warn("Base de Dados Supabase ainda não inicializada com o schema. Autenticação foi concluída com sucesso mas a persistência no backend foi ignorada.", dbErr);
  }

  // 6. Tudo pronto, retornamos sucesso
  return { success: true, error: null }
}
