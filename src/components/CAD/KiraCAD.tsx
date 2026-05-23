import React, { useState } from "react";
import { Bot, Loader2, Sparkles, Paperclip, CloudUpload, Hammer, CheckCircle2, Maximize } from "lucide-react";
import Scene3D from "@/components/Scene3D";
import Blueprint2D from "@/components/Blueprint2D";
import { useAuraStore } from "@/store/useAuraStore";


function ArsenalList() {
  const { inventory, addDeviceFromInventory } = useAuraStore();
  const [catalogCache, setCatalogCache] = useState<any[]>([]);

  React.useEffect(() => {
    fetch('/api/catalog').then(r => r.json()).then(setCatalogCache).catch(()=>{});
  }, []);

  if (inventory.length === 0) {
    return <div className="text-xs text-white/40 px-2 py-4 text-center">Vazio. Adicione no Catálogo.</div>;
  }

  return (
    <>
      {inventory.map(item => {
         const catItem = catalogCache.find(c => c.id === item.catalogId);
         if (!catItem) return null;
         return (
           <button key={item.catalogId} onClick={() => addDeviceFromInventory(catItem)} className="px-3 py-2 bg-white/5 hover:bg-emerald-500/20 border border-white/5 hover:border-emerald-500/50 rounded-xl text-left transition flex items-center justify-between group">
             <div>
               <div className="text-[10px] text-white/50">{catItem.manufacturer}</div>
               <div className="text-xs font-bold text-white truncate max-w-[120px]">{catItem.modelName}</div>
             </div>
             <div className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black px-2 py-1 rounded-md">{item.quantity}</div>
           </button>
         );
      })}
    </>
  );
}

export default function KiraCAD() {
  const { devices, buildMode, toggleDevice, updateDevice, saveToCloud, isSaving, saveSuccess, setBuildMode, addStructuralDevice, isDrawingZone, setIsDrawingZone, setCurrentZonePoints, addZone, setDevices, setActiveLiveWidget, zones } = useAuraStore();

  const [kiraPrompt, setKiraPrompt] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isKiraGenerating, setIsKiraGenerating] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setUploadedImage(ev.target?.result as string);
        setKiraPrompt("Gere a planta em 3D baseada nesta foto do meu croqui.");
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleKiraGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kiraPrompt.trim() && !uploadedImage) return;
    setIsKiraGenerating(true);
    
    try {
      const res = await fetch("/api/kira-vision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: uploadedImage || "no-image", prompt: kiraPrompt })
      });
      
      const json = await res.json();
      
      if (json.data) {
        // 1. Injetar Zonas Matemáticas
        if (json.data.zones) {
          json.data.zones.forEach((z: any) => {
            addZone(z);
          });
        }
        
        // 2. Injetar Paredes, Portas e Janelas
        const injectStructures = (arr: any[], type: "wall" | "door" | "window") => {
          if (!arr) return;
          arr.forEach(item => {
             setDevices((prev: any[]) => [...prev, {
                id: Math.random().toString(),
                type: type,
                position: [item.x, 0, item.z],
                rotation: [0, (item.rot * Math.PI) / 180, 0],
                scale: [item.scaleX, 2.5, type === "wall" ? 0.2 : (type === "door" ? 0.15 : 0.25)]
             }]);
          });
        };
        
        injectStructures(json.data.walls, "wall");
        injectStructures(json.data.doors, "door");
        injectStructures(json.data.windows, "window");
      }
      
    } catch (err) {
      console.error("Kira Vision falhou", err);
    } finally {
      setIsKiraGenerating(false);
      setKiraPrompt("");
      setUploadedImage(null);
    }
  };

  return (
    <div className={`w-full ${buildMode ? "h-[850px]" : "h-[600px]"} border rounded-3xl overflow-hidden relative transition-all duration-500 ${buildMode ? "border-indigo-500/50 bg-black/60" : "border-white/10 bg-black/40"}`}>
      {buildMode ? (
        <div className="flex w-full h-full pt-44 pb-6 px-6 gap-6 relative">
          <div className="flex-[2] h-full relative rounded-2xl shadow-inner border border-white/5 bg-[#0f172a]/50">
            <Blueprint2D devices={devices} onUpdateDevice={updateDevice} />

            {/* TOOLBARS */}
            <div className="absolute top-4 left-4 flex gap-4 z-40 pointer-events-none">
              
              {/* PAINEL ESTRUTURAL */}
              <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded-2xl p-3 flex flex-col gap-2 shadow-2xl pointer-events-auto">
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-2 mb-1">Estrutura & Zonas</div>
                <button onClick={() => { setIsDrawingZone(!isDrawingZone); setCurrentZonePoints([]); }} className={`px-4 py-2 hover:bg-white/10 rounded-xl text-sm font-bold transition flex items-center gap-2 ${isDrawingZone ? "bg-indigo-600 text-white" : "text-white"}`}><Maximize className="w-4 h-4" /> {isDrawingZone ? "Cancelar Zona" : "Desenhar Divisão"}</button>
                <button onClick={() => addStructuralDevice('wall')} className="px-4 py-2 hover:bg-white/10 rounded-xl text-sm font-bold text-white transition flex items-center gap-2">
                  <div className="w-4 h-1 bg-gray-400 rounded-full" /> Parede
                </button>
                <button onClick={() => addStructuralDevice('door')} className="px-4 py-2 hover:bg-white/10 rounded-xl text-sm font-bold text-white transition flex items-center gap-2">
                  <div className="w-4 h-1 bg-amber-700 rounded-full" /> Porta
                </button>
                <button onClick={() => addStructuralDevice('window')} className="px-4 py-2 hover:bg-white/10 rounded-xl text-sm font-bold text-white transition flex items-center gap-2">
                  <div className="w-4 h-1 bg-cyan-400 rounded-full" /> Janela
                </button>
              </div>

              {/* O MEU ARSENAL (INVENTORY) */}
              <div className="bg-black/80 backdrop-blur-md border border-emerald-500/30 rounded-2xl p-3 flex flex-col gap-2 shadow-2xl pointer-events-auto min-w-[200px]">
                <div className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-widest px-2 mb-1 flex items-center gap-2">O Meu Arsenal</div>
                <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {/* We need to fetch the real catalog items for the inventory to show names, but for now we just show buttons based on inventory state */}
                  <ArsenalList />
                </div>
              </div>
            </div>

            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] z-30">
              <div className="bg-black/90 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-4 shadow-[0_0_30px_rgba(99,102,241,0.15)] flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center shrink-0 border border-indigo-500/30 relative overflow-hidden">
                  {uploadedImage ? (
                    <img src={uploadedImage} className="w-full h-full object-cover opacity-60" alt="Croqui" />
                  ) : (
                    <Bot className="w-6 h-6 text-indigo-400" />
                  )}
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="text-sm font-semibold text-indigo-400 mb-1 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Kira Vision AI
                  </div>
                  <form onSubmit={handleKiraGenerate} className="flex gap-2 mt-1 relative">
                    <div className="relative flex-1">
                      <input 
                        type="text" 
                        value={kiraPrompt}
                        onChange={(e) => setKiraPrompt(e.target.value)}
                        disabled={isKiraGenerating}
                        placeholder={uploadedImage ? "Imagem carregada. Gerar Planta..." : "Anexe a foto do seu croqui..."} 
                        className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                      />
                      <label className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white cursor-pointer transition">
                        <Paperclip className="w-5 h-5" />
                        <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                      </label>
                    </div>
                    <button type="submit" disabled={isKiraGenerating || (!kiraPrompt.trim() && !uploadedImage)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-xl font-bold transition flex items-center justify-center min-w-[120px]">
                      {isKiraGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Gerar"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 h-full border border-white/10 rounded-2xl overflow-hidden bg-black relative shadow-2xl">
            <Scene3D buildMode={false} devices={devices} onToggleDevice={toggleDevice} setActiveLiveWidget={setActiveLiveWidget} zones={zones} />
          </div>
        </div>
      ) : (
        <div className="w-full h-full relative">
          <Scene3D buildMode={false} devices={devices} onToggleDevice={toggleDevice} setActiveLiveWidget={setActiveLiveWidget} zones={zones} />
        </div>
      )}
    </div>
  );
}
