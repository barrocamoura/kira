import os

filepath = "src/components/Widgets/AutomationsBuilder.tsx"
with open(filepath, "r") as f:
    content = f.read()

target = '<Background color="#ffffff" gap={20} size={1} opacity={0.05} />'
replacement = '<Background color="#ffffff" gap={20} size={1} />'

if target in content:
    content = content.replace(target, replacement)
    with open(filepath, "w") as f:
        f.write(content)
    print("Fixed opacity")
else:
    print("Target not found")
