import os

filepath = "src/app/login/page.tsx"
with open(filepath, "r") as f:
    content = f.read()

content = content.replace(
    "import { supabase } from '@/lib/supabaseClient';",
    "import { createClient } from '@/utils/supabase/client';"
)

content = content.replace(
    "if (!supabase) throw new Error(\"Chaves Supabase em falta.\");",
    "const supabase = createClient();\n      if (!supabase) throw new Error(\"Chaves Supabase em falta.\");"
)

with open(filepath, "w") as f:
    f.write(content)
