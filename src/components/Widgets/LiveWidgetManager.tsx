import React from "react";
import { X, Camera, Thermometer, Wind, Power, Activity } from "lucide-react";
import { useAuraStore } from "@/store/useAuraStore";

export default function LiveWidgetManager() {
  const { activeLiveWidget, setActiveLiveWidget } = useAuraStore();

  if (!activeLiveWidget) return null;

  const d = activeLiveWidget;

  return (
    <div className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center p-6">
      {/* Overlay background for closing */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto" 
        onClick={() => setActiveLiveWidget(null)} 
      />
      
      {/* The Widget Container */}
      <div className="relative z-50 pointer-events-auto bg-[#0f172a] border border-white/20 shadow-2xl rounded-3xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-black/50 p-4 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-lg">{d.name || d.type}</h3>
            <p className="text-xs text-white/50 uppercase tracking-widest">{d.protocol || "Local Network"}</p>
          </div>
          <button onClick={() => setActiveLiveWidget(null)} className="p-2 hover:bg-white/10 rounded-xl transition text-white/70 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content based on type */}
        <div className="p-6">
          {d.type === "camera" && (
            <div className="flex flex-col gap-4">
              <div className="w-full aspect-video bg-black rounded-xl border border-white/10 overflow-hidden relative group">
                <div className="absolute top-2 left-2 flex items-center gap-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-white tracking-widest uppercase">REC</span>
                </div>
                {/* Fake static noise / camera feed placeholder */}
                <div className="w-full h-full opacity-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                <div className="absolute inset-0 flex items-center justify-center text-white/30 text-xs">
                  <Camera className="w-8 h-8 opacity-50 mb-2" />
                  <br />Ligando ao stream RTSP...
                </div>
              </div>
            </div>
          )}

          {(d.type === "temp_sensor" || d.type === "thermostat") && (
            <div className="flex flex-col items-center py-6">
              <Thermometer className="w-12 h-12 text-teal-400 mb-4" />
              <div className="text-6xl font-black text-white tracking-tighter">23<span className="text-3xl text-white/40">°C</span></div>
              <div className="mt-4 flex gap-6">
                <div className="text-center">
                  <div className="text-xs text-white/40 uppercase font-bold">Humidade</div>
                  <div className="text-lg font-bold text-blue-400">45%</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-white/40 uppercase font-bold">Qualidade</div>
                  <div className="text-lg font-bold text-emerald-400">Excelente</div>
                </div>
              </div>
            </div>
          )}

          {d.type === "ac" && (
            <div className="flex flex-col items-center py-4">
              <Wind className="w-10 h-10 text-blue-400 mb-4" />
              <div className="w-48 h-48 rounded-full border-[10px] border-blue-500/20 border-t-blue-500 flex flex-col items-center justify-center relative">
                <div className="text-5xl font-black text-white">21°</div>
                <div className="text-xs text-white/50 uppercase mt-1">Cooling</div>
              </div>
            </div>
          )}

          {d.type === "light" && (
            <div className="flex flex-col items-center gap-6 py-4">
              <Power className={`w-12 h-12 ${d.isOn ? "text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" : "text-white/20"}`} />
              <div className="w-full px-4">
                <div className="text-xs text-white/50 mb-2 font-bold uppercase">Brilho (100%)</div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-yellow-400" />
                </div>
              </div>
              <div className="w-full px-4 mt-2">
                <div className="text-xs text-white/50 mb-2 font-bold uppercase">Cor</div>
                <div className="flex gap-2 justify-between">
                  {["#ffffff", "#fef08a", "#fecdd3", "#bae6fd", "#bbf7d0"].map(color => (
                    <button key={color} className="w-8 h-8 rounded-full ring-2 ring-white/10 hover:ring-white transition" style={{ backgroundColor: color }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {d.type === "motion_sensor" && (
             <div className="flex flex-col items-center py-8">
               <Activity className={`w-16 h-16 ${d.isOn ? "text-rose-500 animate-pulse" : "text-emerald-500"}`} />
               <div className="mt-4 text-xl font-bold text-white">
                 {d.isOn ? "Movimento Detetado" : "Nenhum Movimento"}
               </div>
               <div className="text-xs text-white/40 mt-2">Último disparo: há 2 min</div>
             </div>
          )}

          {!["camera", "temp_sensor", "thermostat", "ac", "light", "motion_sensor"].includes(d.type) && (
            <div className="text-center py-8 text-white/50">
              Interface avançada não configurada para este dispositivo.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
