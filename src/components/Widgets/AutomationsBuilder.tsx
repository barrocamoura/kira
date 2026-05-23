import React, { useState } from "react";
import { X, Network, Zap, Power, ArrowRight, Save, Trash2, ShieldAlert } from "lucide-react";
import { useAuraStore, Automation } from "@/store/useAuraStore";

export default function AutomationsBuilder({ onClose }: { onClose: () => void }) {
  const { devices, zones, automations, addAutomation, removeAutomation } = useAuraStore();
  
  const [triggerDeviceId, setTriggerDeviceId] = useState("");
  const [triggerCondition, setTriggerCondition] = useState("motion_detected");
  
  const [actionDeviceId, setActionDeviceId] = useState("");
  const [actionCommand, setActionCommand] = useState("turn_on");
  
  const [autoName, setAutoName] = useState("");

  const handleSave = () => {
    if (!triggerDeviceId || !actionDeviceId || !autoName) return;
    const auto: Automation = {
      id: Math.random().toString(),
      name: autoName,
      triggerDeviceId,
      triggerCondition,
      actionDeviceId,
      actionCommand
    };
    addAutomation(auto);
    setAutoName("");
  };

  const getDeviceName = (id: string) => {
    const d = devices.find(d => d.id === id);
    if (!d) return "Desconhecido";
    const zone = d.zoneId ? zones.find(z => z.id === d.zoneId)?.name : "Sem Zona";
    return `${d.name || d.type} (${zone})`;
  };

  const sensors = devices.filter(d => ["motion_sensor", "temp_sensor", "sofa_sensor", "smoke_sensor", "camera", "door_lock"].includes(d.type));
  const actuators = devices.filter(d => ["light", "ac", "smart_tv", "smart_blinds", "speaker", "smart_plug"].includes(d.type));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative z-50 bg-[#0f172a] border border-white/20 shadow-2xl rounded-3xl w-full max-w-5xl h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-black/50 p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <Network className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">Motor de Automações Kira</h2>
              <p className="text-indigo-400/80 text-sm font-semibold tracking-wider uppercase">Consciência Neural do Espaço</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-xl transition text-white/70 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Builder Panel */}
          <div className="flex-1 p-8 overflow-y-auto bg-gradient-to-br from-indigo-500/5 to-purple-500/5">
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-400" /> Nova Automação</h3>
            
            <div className="bg-black/40 border border-white/10 rounded-2xl p-6 flex flex-col gap-6">
              <div>
                <label className="text-xs text-white/50 uppercase font-bold tracking-widest mb-2 block">Nome da Rotina</label>
                <input 
                  type="text" 
                  value={autoName} 
                  onChange={e => setAutoName(e.target.value)} 
                  placeholder="Ex: Cinema na Sala"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-8 items-center relative">
                
                {/* SETA CENTRAL */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 border-[4px] border-[#0f172a] rounded-full p-2 z-10">
                  <ArrowRight className="w-6 h-6 text-white" />
                </div>

                {/* Bloco IF */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-5">
                  <div className="text-blue-400 font-bold mb-4 uppercase tracking-widest text-xs">Se (Condição)</div>
                  
                  <div className="flex flex-col gap-3">
                    <select value={triggerDeviceId} onChange={e => setTriggerDeviceId(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none">
                      <option value="">Selecione o Sensor...</option>
                      {sensors.map(s => <option key={s.id} value={s.id}>{getDeviceName(s.id)}</option>)}
                    </select>

                    <select value={triggerCondition} onChange={e => setTriggerCondition(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-blue-300 text-sm outline-none font-semibold">
                      <option value="motion_detected">Detetar Movimento / Ocupação</option>
                      <option value="temp_high">Temperatura &gt; 25ºC</option>
                      <option value="contact_open">Porta/Janela Aberta</option>
                    </select>
                  </div>
                </div>

                {/* Bloco THEN */}
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5">
                  <div className="text-emerald-400 font-bold mb-4 uppercase tracking-widest text-xs">Então (Ação)</div>
                  
                  <div className="flex flex-col gap-3">
                    <select value={actionDeviceId} onChange={e => setActionDeviceId(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none">
                      <option value="">Selecione o Aparelho...</option>
                      {actuators.map(a => <option key={a.id} value={a.id}>{getDeviceName(a.id)}</option>)}
                    </select>

                    <select value={actionCommand} onChange={e => setActionCommand(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-emerald-300 text-sm outline-none font-semibold">
                      <option value="turn_on">Ligar Equipamento</option>
                      <option value="turn_off">Desligar Equipamento</option>
                      <option value="set_color_blue">Mudar Cor para Azul (Cinema)</option>
                      <option value="set_temp_21">Ajustar AC para 21ºC</option>
                    </select>
                  </div>
                </div>

              </div>

              <button 
                onClick={handleSave} 
                disabled={!triggerDeviceId || !actionDeviceId || !autoName}
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition"
              >
                <Save className="w-5 h-5" /> Salvar Lógica Neural
              </button>
            </div>
            
            {sensors.length === 0 && (
               <div className="mt-6 flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm">
                 <ShieldAlert className="w-5 h-5 shrink-0" />
                 Precisa de adicionar pelo menos um Sensor (Movimento, Sofá, Termostato) à sua planta para criar automações!
               </div>
            )}
          </div>

          {/* List Panel */}
          <div className="w-80 bg-black/60 border-l border-white/10 p-6 flex flex-col">
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Automações Ativas ({automations.length})</h3>
            
            <div className="flex-1 overflow-y-auto flex flex-col gap-3 custom-scrollbar">
              {automations.map(auto => (
                <div key={auto.id} className="bg-white/5 border border-white/10 rounded-xl p-4 group relative">
                  <button onClick={() => removeAutomation(auto.id)} className="absolute top-2 right-2 p-1.5 bg-rose-500/20 text-rose-400 rounded-md opacity-0 group-hover:opacity-100 transition">
                    <Trash2 className="w-3 h-3" />
                  </button>
                  <div className="font-bold text-white text-sm mb-2 pr-6">{auto.name}</div>
                  <div className="text-[10px] text-white/50 leading-relaxed">
                    <span className="text-blue-400 font-semibold">SE:</span> {getDeviceName(auto.triggerDeviceId)} ({auto.triggerCondition})<br/>
                    <span className="text-emerald-400 font-semibold">ENTÃO:</span> {getDeviceName(auto.actionDeviceId)} ({auto.actionCommand})
                  </div>
                </div>
              ))}
              {automations.length === 0 && (
                <div className="text-center text-white/40 text-xs py-8">
                  Nenhuma automação criada.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
