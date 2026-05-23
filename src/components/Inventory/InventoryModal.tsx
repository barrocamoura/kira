import React, { useState, useEffect } from "react";
import { PackageSearch, X, Search, Plus, Minus, Cpu, Activity, Lightbulb, Zap, Snowflake, Speaker, Camera, Lock, CheckCircle2 } from "lucide-react";
import { useAuraStore } from "@/store/useAuraStore";

interface InventoryModalProps {
  onClose: () => void;
}

export default function InventoryModal({ onClose }: InventoryModalProps) {
  const { inventory, changeInventory } = useAuraStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [legacyMode, setLegacyMode] = useState(false);
  const [catalog, setCatalog] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/catalog?q=${encodeURIComponent(searchQuery)}&legacy=${legacyMode}`);
        const data = await res.json();
        setCatalog(data);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    
    // Simple debounce
    const t = setTimeout(fetchCatalog, 300);
    return () => clearTimeout(t);
  }, [searchQuery, legacyMode]);

  const getIcon = (type: string) => {
    switch (type) {
      case "light": return <Lightbulb className="w-5 h-5 text-yellow-400" />;
      case "ac": return <Snowflake className="w-5 h-5 text-blue-400" />;
      case "thermostat": return <Snowflake className="w-5 h-5 text-blue-400" />;
      case "smart_plug": return <Zap className="w-5 h-5 text-green-400" />;
      case "camera": return <Camera className="w-5 h-5 text-red-400" />;
      case "door_lock": return <Lock className="w-5 h-5 text-slate-400" />;
      case "speaker": return <Speaker className="w-5 h-5 text-purple-400" />;
      case "motion_sensor": return <Activity className="w-5 h-5 text-rose-400" />;
      default: return <Cpu className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-white/10 rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <PackageSearch className="w-6 h-6 text-blue-400" /> Registo Universal IoT
            </h2>
            <p className="text-sm text-white/50 mt-1">Integração baseada em comunidades Open-Source. Milhares de dispositivos suportados.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition text-white/70 hover:text-white"><X className="w-6 h-6" /></button>
        </div>
        
        <div className="p-6 bg-black/60 border-b border-white/5 flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input 
              type="text" 
              placeholder="Pesquisa profunda: Marca, Modelo, Zigbee, Wi-Fi..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-white/10 hover:bg-white/5 transition">
            <input type="checkbox" className="sr-only" checked={legacyMode} onChange={(e) => setLegacyMode(e.target.checked)} />
            <div className={`w-10 h-6 rounded-full transition-colors ${legacyMode ? 'bg-rose-500' : 'bg-white/10'} relative`}>
              <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${legacyMode ? 'left-5' : 'left-1'}`} />
            </div>
            <span className="text-sm font-semibold text-white/70">Legacy Mode <span className="text-[10px] text-white/40 block">Descontinuados</span></span>
          </label>
        </div>

        <div className="p-6 flex-1 overflow-y-auto bg-gradient-to-b from-transparent to-black/20 relative">
          {loading && (
            <div className="absolute inset-0 bg-[#0f172a]/50 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          )}
          
          {catalog.length === 0 && !loading ? (
             <div className="text-center text-white/40 py-20">Nenhum dispositivo encontrado.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {catalog.map(item => {
                const qty = inventory.find(i => i.catalogId === item.id)?.quantity || 0;
                return (
                  <div key={item.id} className={`bg-white/5 border rounded-2xl p-4 flex flex-col gap-4 transition group ${item.isDiscontinued ? 'border-orange-500/30' : 'border-white/10 hover:border-blue-500/50'}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-black/50 flex items-center justify-center border border-white/5 shrink-0">
                          {getIcon(item.engine3dType)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-white/50 font-bold uppercase">{item.manufacturer}</span>
                            {item.isDiscontinued && <span className="text-[9px] bg-orange-500/20 text-orange-400 px-1.5 rounded">LEGACY</span>}
                          </div>
                          <div className="text-sm font-bold text-white line-clamp-1" title={item.modelName}>{item.modelName}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-auto">
                      <span className="text-[10px] px-2 py-1 bg-white/10 rounded-md font-mono text-white/70 border border-white/5">{item.protocol}</span>
                      <span className="text-xs text-white/40 ml-auto">{item.releaseYear}</span>
                    </div>

                    <div className="h-px w-full bg-white/10" />

                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-white/40 uppercase">Adicionar ao Arsenal</span>
                      <div className="flex items-center gap-3 bg-black/40 rounded-lg border border-white/10 p-1">
                        <button onClick={() => changeInventory(item.id, -1)} className="w-8 h-8 flex items-center justify-center hover:bg-red-500/20 hover:text-red-400 rounded-md transition disabled:opacity-30" disabled={qty === 0}>
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold w-4 text-center text-sm">{qty}</span>
                        <button onClick={() => changeInventory(item.id, 1)} className="w-8 h-8 flex items-center justify-center bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded-md transition">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        <div className="p-6 border-t border-white/10 bg-black/40 flex items-center justify-between">
          <div className="text-sm text-white/50">
            Itens no seu arsenal: <strong className="text-white">{inventory.reduce((a,b) => a+b.quantity, 0)}</strong>
          </div>
          <button onClick={onClose} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" /> Concluir
          </button>
        </div>
      </div>
    </div>
  );
}
