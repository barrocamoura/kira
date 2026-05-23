import os

filepath = "src/utils/supabase/middleware.ts"
with open(filepath, "r") as f:
    content = f.read()

target = """  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,"""

replacement = """  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // Modo de demonstração / sem chaves: Não bloquear o site inteiro, apenas avisar e deixar passar
    console.warn("Supabase keys missing. Middleware bypassing auth.")
    return supabaseResponse
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,"""

content = content.replace(target, replacement)

with open(filepath, "w") as f:
    f.write(content)
