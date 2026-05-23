import os

filepath = "src/components/Blueprint2D.tsx"
with open(filepath, "r") as f:
    content = f.read()

target = "let foundZoneId = null;"
replacement = "let foundZoneId: string | undefined = undefined;"

content = content.replace(target, replacement)

with open(filepath, "w") as f:
    f.write(content)

