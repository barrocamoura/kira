"use client";

import React, { useState } from "react";
import { Thermometer, PackageSearch, Hammer, CloudUpload, Loader2, CheckCircle2 } from "lucide-react";
import { AuraStoreProvider, useAuraStore } from "@/store/useAuraStore";
import KiraCAD from "@/components/CAD/KiraCAD";
import InventoryModal from "@/components/Inventory/InventoryModal";
import LiveWidgetManager from "@/components/Widgets/LiveWidgetManager";
import AutomationsBuilder from "@/components/Widgets/AutomationsBuilder";
import WhitelabelSettings from "@/components/Widgets/WhitelabelSettings";
import { ShieldAlert } from "lucide-react";
import { Network, Building2, MapPin, Plus, ChevronDown } from "lucide-react";

function DashboardContent() {
  const [inventoryModalOpen, setInventoryModalOpen] = useState(false);
  const [autoBuilderOpen, setAutoBuilderOpen] = useState(false);
  const [whitelabelOpen, setWhitelabelOpen] = useState(false);
  const { buildMode, setBuildMode, saveToCloud, isSaving, saveSuccess, sites, activeSiteId, setActiveSite, addSite, whitelabelConfig } = useAuraStore();

  return (
    <div className="flex flex-col gap-8 pb-12 relative min-h-screen">
      <LiveWidgetManager />
      {inventoryModalOpen && <InventoryModal onClose={() => setInventoryModalOpen(false)} />}
      {autoBuilderOpen && <AutomationsBuilder onClose={() => setAutoBuilderOpen(false)} />}
      {whitelabelOpen && <WhitelabelSettings onClose={() => setWhitelabelOpen(false)} />}

      
      {/* TOP BAR / SITE SELECTOR */}
      <div className="flex items-center justify-between bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl w-full relative z-50">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-black text-white flex items-center gap-3 border-r border-white/10 pr-6">
            {whitelabelConfig.isActive && whitelabelConfig.logoBase64 ? (
              <img src={whitelabelConfig.logoBase64} alt="Logo" className="h-8 object-contain" />
            ) : (
              <span className="bg-clip-text text-transparent bg-gradient-to-r" style={{ backgroundImage: whitelabelConfig.isActive ? `linear-gradient(to right, ${whitelabelConfig.primaryColor}, #ffffff)` : "linear-gradient(to right, #60a5fa, #6366f1)" }}>
                {whitelabelConfig.isActive ? whitelabelConfig.companyName : "Aura OS"}
              </span>
            )}
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
        <div className="hidden md:flex items-center gap-4">
          <div className="text-white/50 text-sm font-medium mr-4">Painel de Controlo Multi-Site</div>
          {!whitelabelConfig.isActive && (
            <button onClick={() => setWhitelabelOpen(true)} className="p-2 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition flex items-center gap-2 text-xs font-bold uppercase tracking-widest border border-white/10">
              <ShieldAlert className="w-4 h-4 text-emerald-400" /> Modo Integrador
            </button>
          )}
        </div>
      </div>

      <div className="w-full rounded-3xl p-8 flex items-center justify-between backdrop-blur-md relative z-10 border" style={{ backgroundColor: whitelabelConfig.isActive ? `${whitelabelConfig.primaryColor}20` : "rgba(79, 70, 229, 0.2)", borderColor: whitelabelConfig.isActive ? `${whitelabelConfig.primaryColor}50` : "rgba(59, 130, 246, 0.3)" }}>
        <div>
          <h2 className="text-3xl font-bold mb-2 text-white">Olá, Alessandro</h2>
          <p className="text-white/60">Aura OS: Operacional. Casa em <span className="text-emerald-400 font-semibold">Eficiência Máxima</span>.</p>
        </div>
        <div className="hidden md:flex items-center gap-4 bg-black/40 px-6 py-4 rounded-2xl border border-white/5">
          <Thermometer className="w-8 h-8 text-orange-400" />
          <div>
            <div className="text-xs text-white/50 uppercase tracking-widest font-bold">Temperatura</div>
            <div className="text-2xl font-bold text-white">23°C</div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center relative z-10">
        <div className={`backdrop-blur-md px-4 py-2 rounded-xl border text-sm font-semibold transition-colors flex items-center gap-3 ${buildMode ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-400" : "bg-black/50 border-white/10 text-white"}`} style={whitelabelConfig.isActive ? { borderColor: `${whitelabelConfig.primaryColor}50`, color: whitelabelConfig.primaryColor } : {}}>
          {buildMode ? "Kira CAD: MODO ARQUITETO" : (whitelabelConfig.isActive ? `${whitelabelConfig.companyName} SMART CONTROL` : "Aura OS: LIVE CONTROL")}
          {saveSuccess && <span className="text-emerald-400 text-xs flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Sincronizado</span>}
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setInventoryModalOpen(true)}
            className="flex items-center gap-2 backdrop-blur-md border px-5 py-3 rounded-xl text-sm font-bold transition bg-blue-500/20 border-blue-500/50 text-blue-400 hover:bg-blue-500/30"
          >
            <PackageSearch className="w-4 h-4" />
            Catálogo & Compras IoT
          </button>
          
          <button 
            onClick={() => setAutoBuilderOpen(true)}
            className="flex items-center gap-2 backdrop-blur-md border px-5 py-3 rounded-xl text-sm font-bold transition bg-purple-500/20 border-purple-500/50 text-purple-400 hover:bg-purple-500/30"
          >
            <Network className="w-4 h-4" />
            Motor de Automações
          </button>
          
          <button 
            onClick={() => {
              if (buildMode) saveToCloud();
              setBuildMode(!buildMode);
            }}
            disabled={isSaving}
            className={`flex items-center gap-2 backdrop-blur-md border px-5 py-3 rounded-xl text-sm font-bold transition ${buildMode ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/30" : "bg-white/10 border-white/10 text-white hover:bg-white/20"}`}
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : buildMode ? <CloudUpload className="w-4 h-4" /> : <Hammer className="w-4 h-4" />}
            {isSaving ? "A Sincronizar..." : buildMode ? "Sincronizar Cloud" : "Ativar Kira CAD"}
          </button>
        </div>
      </div>

      <div className="relative z-10 w-full h-[800px]">
        <KiraCAD />
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <AuraStoreProvider>
      <DashboardContent />
    </AuraStoreProvider>
  );
}
