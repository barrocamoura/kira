import os

filepath = "src/app/dashboard/page.tsx"
with open(filepath, "r") as f:
    content = f.read()

# Import Building/MapPin/Plus
target_import = "import { Network } from \"lucide-react\";"
replacement_import = "import { Network, Building2, MapPin, Plus, ChevronDown } from \"lucide-react\";"
content = content.replace(target_import, replacement_import)

# Fetch site state
target_store = "const { buildMode, setBuildMode, inventory } = useAuraStore();"
replacement_store = "const { buildMode, setBuildMode, inventory, sites, activeSiteId, setActiveSite, addSite } = useAuraStore();"
content = content.replace(target_store, replacement_store)

# UI for the selector
target_ui = """<div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
              Aura OS
            </span>
            <span className="px-2 py-1 bg-white/10 rounded-md text-xs font-bold text-white/50 tracking-widest uppercase">PRO</span>
          </h1>
          <p className="text-white/50 mt-1">Bem-vindo, Alessandro. O seu ecossistema está online.</p>
        </div>"""

replacement_ui = """<div className="flex flex-col gap-6 mb-8 relative z-40">
        
        {/* TOP BAR / SITE SELECTOR */}
        <div className="flex items-center justify-between bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl w-full">
          
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-black text-white flex items-center gap-3 border-r border-white/10 pr-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
                Aura OS
              </span>
            </h1>
            
            <div className="relative group">
              <button className="flex items-center gap-3 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition text-white text-sm font-bold min-w-[200px]">
                <Building2 className="w-4 h-4 text-indigo-400" />
                <span className="flex-1 text-left truncate">{sites.find((s: any) => s.id === activeSiteId)?.name || "Local Desconhecido"}</span>
                <ChevronDown className="w-4 h-4 text-white/50 group-hover:text-white transition" />
              </button>
              
              {/* Dropdown Localizações */}
              <div className="absolute top-full left-0 mt-2 w-64 bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0">
                <div className="p-2 flex flex-col gap-1">
                  {sites.map((site: any) => (
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
          
          <div className="text-white/50 text-sm font-medium">
            Bem-vindo, Alessandro.
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div /> {/* Spacer para empurrar botões para a direita caso não haja título aqui */}"""

content = content.replace(target_ui, replacement_ui)

with open(filepath, "w") as f:
    f.write(content)

