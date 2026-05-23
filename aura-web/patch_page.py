import os

filepath = "src/app/page.tsx"
with open(filepath, "r") as f:
    content = f.read()

target = """<button className="w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 font-bold transition mb-8">Começar Agora</button>"""

replacement = """<button 
                onClick={async () => {
                  try {
                    const res = await fetch('/api/checkout', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ plan: 'home' })
                    });
                    const data = await res.json();
                    if (data.url) {
                      window.location.href = data.url;
                    } else {
                      alert(data.error || 'Erro ao iniciar pagamento.');
                    }
                  } catch(e) {
                    alert('Erro na ligação.');
                  }
                }}
                className="w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 font-bold transition mb-8"
              >
                Começar Agora
              </button>"""

if target in content:
    content = content.replace(target, replacement)

with open(filepath, "w") as f:
    f.write(content)
