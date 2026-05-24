import os

filepath = "src/app/login/page.tsx"
with open(filepath, "r") as f:
    content = f.read()

target = """        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName
            }
          }
        });"""

replacement = """        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName
            },
            emailRedirectTo: `${window.location.origin}/onboarding`
          }
        });"""

if target in content:
    content = content.replace(target, replacement)
    with open(filepath, "w") as f:
        f.write(content)
    print("Fixed signUp")
else:
    print("signUp block not found")
