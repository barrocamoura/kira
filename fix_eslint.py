import os

f1 = "src/app/dashboard/automations/page.tsx"
with open(f1, "r") as f:
    content = f.read()
content = content.replace('" {generatedScene.voiceResponse} "', '&quot; {generatedScene.voiceResponse} &quot;')
with open(f1, "w") as f:
    f.write(content)

f2 = "src/components/Blueprint2D.tsx"
with open(f2, "r") as f:
    content = f.read()
content = content.replace("Clique 'Salvar & Concluir' para", "Clique &apos;Salvar & Concluir&apos; para")
with open(f2, "w") as f:
    f.write(content)

