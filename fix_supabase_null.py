import os

filepath = "src/components/Widgets/AutomationsBuilder.tsx"
with open(filepath, "r") as f:
    content = f.read()

target = "const { data, error } = await supabase.from('automations').insert(newAuto).select().single();"
replacement = """if (!supabase) throw new Error("Supabase client not initialized.");
        const { data, error } = await supabase.from('automations').insert(newAuto).select().single();"""

if target in content:
    content = content.replace(target, replacement)
    with open(filepath, "w") as f:
        f.write(content)
    print("Fixed")
else:
    print("Not found")
