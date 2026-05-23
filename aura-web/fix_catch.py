import os

filepath = "src/store/useAuraStore.tsx"
with open(filepath, "r") as f:
    content = f.read()

target = "}, { onConflict: 'id' }).catch(() => {});"
replacement = "}, { onConflict: 'id' });"

content = content.replace(target, replacement)

with open(filepath, "w") as f:
    f.write(content)
