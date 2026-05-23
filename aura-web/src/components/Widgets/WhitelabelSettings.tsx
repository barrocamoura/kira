import React, { useRef } from "react";
import { X, Palette, Image as ImageIcon, Briefcase, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useAuraStore } from "@/store/useAuraStore";

export default function WhitelabelSettings({ onClose }: { onClose: () => void }) {
  const { whitelabelConfig, updateWhitelabel } = useAuraStore();

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        updateWhitelabel({ logoBase64: ev.target?.result as string });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative z-50 bg-[#0f172a] border border-white/20 shadow-2xl rounded-3xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 text-white rounded-xl border border-white/20">
              <Briefcase className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">Painel do Integrador (B2B)</h2>
              <p className="text-indigo-300 text-sm font-semibold tracking-wider uppercase">Portal Whitelabel</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-xl transition text-white/70 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 flex flex-col gap-8">
          
          <div className="flex items-center justify-between p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${whitelabelConfig.isActive ? "bg-emerald-500 text-white" : "bg-white/10 text-white/50"}`}>
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Visão do Cliente Final</h3>
                <p className="text-emerald-400/80 text-sm">Oculta ferramentas do Instalador (Kira CAD) e aplica o Branding.</p>
              </div>
            </div>
            <button 
              onClick={() => updateWhitelabel({ isActive: !whitelabelConfig.isActive })}
              className={`relative w-16 h-8 rounded-full transition-colors ${whitelabelConfig.isActive ? "bg-emerald-500" : "bg-white/20"}`}
            >
              <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all shadow-md ${whitelabelConfig.isActive ? "left-9" : "left-1"}`} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs text-white/50 uppercase font-bold tracking-widest">Nome da Empresa</label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input 
                  type="text" 
                  value={whitelabelConfig.companyName} 
                  onChange={e => updateWhitelabel({ companyName: e.target.value })} 
                  className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-white/50 uppercase font-bold tracking-widest">Cor da Marca (Hex)</label>
              <div className="relative flex items-center gap-3 bg-black/50 border border-white/10 rounded-xl p-2 pr-4 focus-within:border-indigo-500 transition">
                <input 
                  type="color" 
                  value={whitelabelConfig.primaryColor} 
                  onChange={e => updateWhitelabel({ primaryColor: e.target.value })} 
                  className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
                />
                <input 
                  type="text"
                  value={whitelabelConfig.primaryColor}
                  onChange={e => updateWhitelabel({ primaryColor: e.target.value })}
                  className="flex-1 bg-transparent text-white focus:outline-none font-mono uppercase text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-white/50 uppercase font-bold tracking-widest">Logótipo do Instalador</label>
            <div className="flex items-center gap-6 p-6 border-2 border-dashed border-white/10 rounded-2xl bg-black/20">
              <div className="w-24 h-24 rounded-xl bg-white/5 flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
                {whitelabelConfig.logoBase64 ? (
                  <img src={whitelabelConfig.logoBase64} className="w-full h-full object-contain p-2" alt="Logo" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-white/20" />
                )}
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-sm text-white/60">Faça upload do logo da sua empresa para substituir a marca Aura OS.</p>
                <label className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg font-bold text-sm transition cursor-pointer w-fit inline-flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" /> Escolher Imagem
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                </label>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
