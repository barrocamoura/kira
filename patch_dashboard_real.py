import os

filepath = "src/app/dashboard/page.tsx"
with open(filepath, "r") as f:
    content = f.read()

# 1. Update the store hook to extract sites logic
target_hook = "const { buildMode, setBuildMode, saveToCloud, isSaving, saveSuccess } = useAuraStore();"
replacement_hook = "const { buildMode, setBuildMode, saveToCloud, isSaving, saveSuccess, sites, activeSiteId, setActiveSite, addSite } = useAuraStore();"
content = content.replace(target_hook, replacement_hook)

# 2. Inject the Top Bar before the "Olá, Alessandro" banner
target_banner = """<div className="w-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-3xl p-8 flex items-center justify-between backdrop-blur-md relative z-10">"""
replacement_banner = """
      {/* TOP BAR / SITE SELECTOR */}
      <div className="flex items-center justify-between bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl w-full relative z-50">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-black text-white flex items-center gap-3 border-r border-white/10 pr-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
              Aura OS
            </span>
          </h1>
          <div className="relative group">
            <button className="flex items-center gap-3 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition text-white text-sm font-bold min-w-[200px]">
              <Building2 className="w-4 h-4 text-indigo-400" />
              <span className="flex-1 text-left truncate">{sites?.find((s: any) => s.id === activeSiteId)?.name || "Local Desconhecido"}</span>
              <ChevronDown className="w-4 h-4 text-white/50 group-hover:text-white transition" />
            </button>
            
            {/* Dropdown Localizações */}
            <div className="absolute top-full left-0 mt-2 w-64 bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0">
              <div className="p-2 flex flex-col gap-1">
                {sites?.map((site: any) => (
                  <button 
                    key={site.id} 
                    onClick={() => setActiveSite(site.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition text-left ${activeSiteId === site.id ? "bg-indigo-600 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"}`}
                  >
                    <MapPin className={`w-4 h-4 ${activeSiteId === site.id ? "text-white" : "text-indigo-400"}`} />
                    {site.name}
                  </button>
                ))}
                <div className="h-px bg-white/10 my-1" />
                <button 
                  onClick={() => {
                    const name = prompt("Nome do novo local (ex: Casa de Férias):");
                    if (name) addSite({ id: "site_" + Date.now(), name, type: "house" });
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-emerald-400 hover:bg-emerald-500/10 transition text-left"
                >
                  <Plus className="w-4 h-4" />
                  Novo Projeto...
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="text-white/50 text-sm font-medium hidden md:block">
          Painel de Controlo Multi-Site
        </div>
      </div>

      <div className="w-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-3xl p-8 flex items-center justify-between backdrop-blur-md relative z-10">"""
content = content.replace(target_banner, replacement_banner)

with open(filepath, "w") as f:
    f.write(content)
