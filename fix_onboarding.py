import os

filepath = "src/app/onboarding/page.tsx"
with open(filepath, "r") as f:
    content = f.read()

# Remover campo fullName do onboarding
target_input = """            <div>
              <label className="text-sm font-medium text-white/70 block mb-2 flex items-center gap-2">
                <User className="w-4 h-4" /> Nome Completo
              </label>
              <input 
                type="text" 
                name="fullName"
                placeholder="Ex: Alessandro Moura" 
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
                required
              />
            </div>"""

if target_input in content:
    content = content.replace(target_input, "")
    
    # Mudar md:grid-cols-2 para md:grid-cols-1 ou apenas remover a grid
    content = content.replace('className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"', 'className="flex flex-col gap-6 mb-8"')
    
    with open(filepath, "w") as f:
        f.write(content)
    print("Fixed onboarding UI")
else:
    print("fullName block not found")

filepath_action = "src/app/actions/workspace.ts"
with open(filepath_action, "r") as f:
    action_content = f.read()

target_action = """  const fullName = formData.get('fullName') as string
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
    })"""

replacement_action = """  const phone = formData.get('phone') as string
  const spaceName = formData.get('spaceName') as string
  const planType = formData.get('planType') as string

  // 3. Atualiza os dados de contacto do Usuário
  const { error: userError } = await supabase
    .from('users')
    .update({ 
      phone: phone
    })
    .eq('id', user.id)"""

if target_action in action_content:
    action_content = action_content.replace(target_action, replacement_action)
    with open(filepath_action, "w") as f:
        f.write(action_content)
    print("Fixed workspace action")
else:
    print("Action block not found")

