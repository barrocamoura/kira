import os

filepath = "src/app/page.tsx"
with open(filepath, "r") as f:
    content = f.read()

if '"use client"' not in content and "'use client'" not in content:
    content = '"use client";\n' + content

with open(filepath, "w") as f:
    f.write(content)
