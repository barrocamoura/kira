import os

filepath = "src/app/dashboard/page.tsx"
with open(filepath, "r") as f:
    content = f.read()

# 1. Imports
target_imports = "import AutomationsBuilder from \"@/components/Widgets/AutomationsBuilder\";"
replacement_imports = "import AutomationsBuilder from \"@/components/Widgets/AutomationsBuilder\";\nimport WhitelabelSettings from \"@/components/Widgets/WhitelabelSettings\";\nimport { ShieldAlert } from \"lucide-react\";"
content = content.replace(target_imports, replacement_imports)

# 2. Add state and destructure config
target_state = "const [autoBuilderOpen, setAutoBuilderOpen] = useState(false);"
replacement_state = "const [autoBuilderOpen, setAutoBuilderOpen] = useState(false);\n  const [whitelabelOpen, setWhitelabelOpen] = useState(false);"
content = content.replace(target_state, replacement_state)

target_hook = "const { buildMode, setBuildMode, saveToCloud, isSaving, saveSuccess, sites, activeSiteId, setActiveSite, addSite } = useAuraStore();"
replacement_hook = "const { buildMode, setBuildMode, saveToCloud, isSaving, saveSuccess, sites, activeSiteId, setActiveSite, addSite, whitelabelConfig } = useAuraStore();"
content = content.replace(target_hook, replacement_hook)

# 3. Add Modal Render
target_modal = "{autoBuilderOpen && <AutomationsBuilder onClose={() => setAutoBuilderOpen(false)} />}"
replacement_modal = "{autoBuilderOpen && <AutomationsBuilder onClose={() => setAutoBuilderOpen(false)} />}\n      {whitelabelOpen && <WhitelabelSettings onClose={() => setWhitelabelOpen(false)} />}"
content = content.replace(target_modal, replacement_modal)

# 4. Top Bar Branding
target_branding = """<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
              Aura OS
            </span>"""
replacement_branding = """{whitelabelConfig.isActive && whitelabelConfig.logoBase64 ? (
              <img src={whitelabelConfig.logoBase64} alt="Logo" className="h-8 object-contain" />
            ) : (
              <span className="bg-clip-text text-transparent bg-gradient-to-r" style={{ backgroundImage: whitelabelConfig.isActive ? `linear-gradient(to right, ${whitelabelConfig.primaryColor}, #ffffff)` : "linear-gradient(to right, #60a5fa, #6366f1)" }}>
                {whitelabelConfig.isActive ? whitelabelConfig.companyName : "Aura OS"}
              </span>
            )}"""
content = content.replace(target_branding, replacement_branding)

# 5. Right side of Top Bar (Add Whitelabel Settings Button)
target_top_right = """<div className="text-white/50 text-sm font-medium hidden md:block">
          Painel de Controlo Multi-Site
        </div>"""
replacement_top_right = """<div className="hidden md:flex items-center gap-4">
          <div className="text-white/50 text-sm font-medium mr-4">Painel de Controlo Multi-Site</div>
          {!whitelabelConfig.isActive && (
            <button onClick={() => setWhitelabelOpen(true)} className="p-2 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition flex items-center gap-2 text-xs font-bold uppercase tracking-widest border border-white/10">
              <ShieldAlert className="w-4 h-4 text-emerald-400" /> Modo Integrador
            </button>
          )}
        </div>"""
content = content.replace(target_top_right, replacement_top_right)

# 6. Apply Primary Color to the main gradient panel and "Olá, Alessandro" banner
target_banner = """<div className="w-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-3xl p-8 flex items-center justify-between backdrop-blur-md relative z-10">"""
replacement_banner = """<div className="w-full rounded-3xl p-8 flex items-center justify-between backdrop-blur-md relative z-10 border" style={{ backgroundColor: whitelabelConfig.isActive ? `${whitelabelConfig.primaryColor}20` : "rgba(79, 70, 229, 0.2)", borderColor: whitelabelConfig.isActive ? `${whitelabelConfig.primaryColor}50` : "rgba(59, 130, 246, 0.3)" }}>"""
content = content.replace(target_banner, replacement_banner)

# 7. Hide "Kira CAD" Button when whitelabel is active
target_cad_button = """<div className="flex justify-between items-center relative z-10">
        <div className={`backdrop-blur-md px-4 py-2 rounded-xl border text-sm font-semibold transition-colors flex items-center gap-3 ${buildMode ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-400" : "bg-black/50 border-white/10 text-white"}`}>
          {buildMode ? "Kira CAD: MODO ARQUITETO" : "Aura OS: LIVE CONTROL"}"""

replacement_cad_button = """<div className="flex justify-between items-center relative z-10">
        <div className={`backdrop-blur-md px-4 py-2 rounded-xl border text-sm font-semibold transition-colors flex items-center gap-3 ${buildMode ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-400" : "bg-black/50 border-white/10 text-white"}`} style={whitelabelConfig.isActive ? { borderColor: `${whitelabelConfig.primaryColor}50`, color: whitelabelConfig.primaryColor } : {}}>
          {buildMode ? "Kira CAD: MODO ARQUITETO" : (whitelabelConfig.isActive ? `${whitelabelConfig.companyName} SMART CONTROL` : "Aura OS: LIVE CONTROL")}"""
content = content.replace(target_cad_button, replacement_cad_button)

target_toggle_button = """<button onClick={() => setBuildMode(!buildMode)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg transition">
            <Hammer className="w-4 h-4" />
            {buildMode ? "Sair do Arquiteto" : "Kira CAD"}
          </button>"""
replacement_toggle_button = """{!whitelabelConfig.isActive && (
          <button onClick={() => setBuildMode(!buildMode)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg transition">
            <Hammer className="w-4 h-4" />
            {buildMode ? "Sair do Arquiteto" : "Kira CAD"}
          </button>
        )}"""
content = content.replace(target_toggle_button, replacement_toggle_button)

with open(filepath, "w") as f:
    f.write(content)
